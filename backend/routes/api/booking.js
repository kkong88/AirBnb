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
const booking = require('../../db/models/booking');
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
    let resObj = []

    bookings.forEach(booking => {
        resObj.push({
            id: booking.id,
            userId: booking.userId,
            spotId: booking.spotId,
            startDate: booking.startDate.toISOString().slice(0,10),
            endDate: booking.endDate.toISOString().slice(0,10),
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
             Spot: {
                id: booking.Spot.id,
                ownerId: booking.Spot.ownerId,
                address: booking.Spot.address,
                city: booking.Spot.city,
                state: booking.Spot.state,
                country: booking.Spot.country,
                lat: booking.Spot.lat,
                lng: booking.Spot.lng,
                name: booking.Spot.name,
                price: booking.Spot.price,
                previewImage: booking.Spot.dataValues.previewImage
             }
        })
    })

   return res.json({Bookings:resObj})
})

// edit a booking based on booking id
router.put('/:id', requireAuth, async(req, res)=>{
    const { startDate, endDate } = req.body
    let booking = await Booking.findByPk(req.params.id)
    if(!booking){
       return res.status(404).json({message: "Booking couldn't be found", statusCode: 404})
    }
    if(startDate > endDate){
        return res.status(400).json({message: "Validation error", statusCode:400, errors: ["endDate cannot be on or before startDate"]})
    }
    let currentDate = booking.startDate.toISOString().slice(0,10)

    let today = new Date().toJSON().slice(0,10)
    if(today > endDate){
        return res.status(403).json({message: "Past bookings can't be modified", statusCode: 403})
    }
    if(currentDate === startDate){
        return res.status(403).json({message: "Sorry, this spot is already booked for the specified dates",statusCode:403, errors: ["Start date conflicts with an existing booking",
      "End date conflicts with an existing booking"]})
    }

    booking.update({
        startDate: startDate,
        endDate: endDate,
    })
    let resObj = {
        id: booking.id,
        userId: booking.userId,
        spotId: booking.spotId,
        startDate: booking.startDate.toISOString().slice(0,10),
        endDate: booking.endDate.toISOString().slice(0,10),
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
    }
    await booking.save()
    res.json(resObj)
})

// delete booking based on booking id
router.delete('/:id', requireAuth, async (req,res)=>{
    const booking = await Booking.findByPk(req.params.id,{
        where: {userId: req.user.id}
    })
    let start = Booking.startDate
    if(start){
        return res.status(403).json({massage: "Bookings that have been started can't be deleted", statusCode:403})
    }
    if(!booking){
        return res.status(404).json({message: "Booking couldn't be found", statusCode:404})
    }
    await booking.destroy()
    res.status(200).json({message: "Successfully deleted", statusCode: 200})
})




module.exports = router;
