const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models')
const { SpotImage } = require('../../db/models')
const { reviewImage } = require('../../db/models')
const { Booking } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const sequelize = require('sequelize');
const review = require('../../db/models/review');
const spotimage = require('../../db/models/spotimage');
const router = express.Router();

const validateImage = [
    check('review')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Review must contain text'),
check('stars')
    .exists({checkFalsy:true})
    .notEmpty()
    .isInt({min: 1, max: 5})
    .withMessage('Must be a number between 1 to 5'),
handleValidationErrors
]

router.get('/current', requireAuth, async (req, res)=> {
    const reviews = await Review.findAll({
         where: { userId: req.user.id},
         include: [
         {
          model: User,
          attributes:['id', 'firstName', 'lastName']
         },
         {
        model: Spot,
         attributes: {
          exclude: ['createdAt', 'updatedAt']
         }
        },
         {
         model: reviewImage,
         attributes: {
         exclude: ['createdAt', 'updatedAt']
         }
         }
        ],
    })
    for await (let review of reviews){
        const image = await SpotImage.findOne({
          where: {
            spotId: review.Spot.id,
            preview: true
          }
        })
        if(image){
          review.Spot.dataValues.previewImage = image.url
        } else {
          review.Spot.dataValues.previewImage = 'No preview image'
        }
    }


    res.json({reviews})
})

// router.post('/:id/images', requireAuth, async (req, res)=> {
//     const { url } = req.body
//     let image = await Review.findByPk(req.params.id)
//      image = await reviewImage.create(
//         {
//             url: url
//         })
//         if (image.length > 10){
//             res.status(403).json({message: 'Maximum number of image for this reached', statusCode: 403})
//         }
//         if(!image){
//             res.status(404).json({message: 'Review couldnt be found', statusCode: 404})
//         }
//     res.json(image)
// })

router.post('/:id/images', requireAuth, async (req, res) => {
    const { url } = req.body
    const review = await Review.findByPk(req.params.id)
    if(!review){
      return res.status(404).json({message: 'Review couldnt be found', statusCode: 404})
    }
    const imageReview = await reviewImage.findAll({
        where: {
            reviewId: review.id
        }
    })
     if (imageReview.length >= 10){
       return res.status(403).json({message: 'Maximum number of image for this resource was reached', statusCode: 403})
    } else {
        const image = await reviewImage.create({
            reviewId : review.id,
            url: url
        })
        const obj = {
            id: image.id,
            url: image.url
        }
        res.json(obj)
    }
})

//edit a review
router.put('/:id', validateImage ,requireAuth, async (req, res) =>{
    const { review, stars } = req.body
    let updateReview = await Review.findByPk(req.params.id)
    if(!updateReview){
       return res.status(404).json({message: 'Review couldnt be found', statusCode:404})
    }
     updateReview.update({
        review: review,
        star: stars
    })
    await updateReview.save()
   res.json(updateReview)
})

// delete a review
router.delete('/:id', requireAuth, async (req, res) => {
    const reviews = await Review.findByPk(req.params.id)
    if(!reviews){
        res.status(404).json({message: 'Review couldnt be found', statusCode: 404})
    } else {
        await reviews.destroy()
        res.status(200).json({message: 'Successfully deleted', statusCode: 200})
    }
})

module.exports = router;
