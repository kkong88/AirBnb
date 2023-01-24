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

router.get('/current', async (req, res)=> {
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
            [[sequelize.literal(`(SELECT image FROM spotImages WHERE spotId = Spot.id AND preview = true)`),`previewImage`]],
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

router.get('/:id/reviews', async (req,res) => {
    const reviews = await Review.findByPk(req.params.id,{
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName']
            },{
            model: reviewImage,
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
            }
        ]
    })
    if(!reviews){
        res.status(404).json({message: "Spot couldn't be found"})
    }
    res.json({reviews})
})

module.exports = router;
