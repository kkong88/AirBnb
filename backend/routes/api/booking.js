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

router.get('/current', requireAuth, async(req, res)=>{
    const bookings = await Booking.findAll({
        where: {userId: req.user.id},
        include: [
            {
                model: Spot,
                attributes: {
                    include:
                    [[sequelize.literal(`(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`),`previewImage`]],
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
    })
   return res.json({Bookings:bookings})
})



module.exports = router;
