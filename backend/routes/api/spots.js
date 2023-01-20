const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Sequelize } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const { where } = require('sequelize');
const review = require('../../db/models/review');
const router = express.Router();


router.get('/', async(req,res)=>{
    const spots = await Spot.findAll()
    res.json({spots})
})

router.get('/current', async (req, res) => {
    const current = await Spot.findAll({
        where: { ownerId: req.user.id }
    })
    res.json({current})
})

router.get('/:id', async (req, res) => {
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId, {
        attributes: {
            include: [[Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating'],[Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),'numReviews']]
        },
        include: [
        {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: Review,
            attributes: [],
            subQuery: false
        }
    ]
    })
    res.json({spot})
})


router.post('/', async (req, res) => {
    try {
    const { address, city, state, country, lat, lng, name, description, price, ownerId } = req.body

    const newSpot = await Spot.create(
        {
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price,
            ownerId: req.user.id,
        })
        return res.json({newSpot})
    }
      catch {
        const err = new Error('Validation Error')
        err.status = 400
        err.errors =[
            "Street address is required",
            "City is required",
            "State is required",
            "Country is required",
            "Latitude is not valid",
            "Longitude is not valid",
            "Name must be less than 50 characters",
            "Description is required",
            "Price per day is required"
        ]
        throw err
      }
})


module.exports = router;
