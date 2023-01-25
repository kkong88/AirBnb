const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models')
const { SpotImage } = require('../../db/models')
const { reviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const sequelize = require('sequelize');
const review = require('../../db/models/review');
const spotimage = require('../../db/models/spotimage');
const router = express.Router();

const validateImage = [
    check()
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
            include:
            [[sequelize.literal(`(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`),`previewImage`]],
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
    const imageReview = await reviewImage.findAll({
        where: {
            reviewId: review.id
        }
    })
    if(!review){
        res.status(404).json({message: 'Review couldnt be found'})
    } else if (imageReview.length >= 10){
        res.status(403).json({message: 'Maximum number of image for this resource was reached'})
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

module.exports = router;
