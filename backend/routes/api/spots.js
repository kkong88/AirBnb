const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Sequelize } = require('../../db/models');
const { User } = require('../../db/models');
const { Review } = require('../../db/models')
const { SpotImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spot = require('../../db/models/spot');
const { where } = require('sequelize');
const review = require('../../db/models/review');
const spotimage = require('../../db/models/spotimage');
const router = express.Router();

// Get all spots
router.get('/', async(req,res)=>{
    const spots = await Spot.findAll()
    res.json({spots})
})
// Get current users
router.get('/current', async (req, res) => {
    const current = await Spot.findAll({
        where: { ownerId: req.user.id }
    })
    res.json({current})
})
//Get details of a spot from an id
// router.get('/:id', async (req, res) => {
//     const spotId = req.params.id
//     const spot = await Spot.findByPk(spotId, {
//         attributes: {
//             include: [[Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating'],[Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),'numReviews']]
//         },
//         include: [
//         {
//             model: User,
//             as: 'Owner',
//             attributes: ['id', 'firstName', 'lastName']
//         },
//         {
//             model: SpotImage,
//             attributes: ['spotId','image']
//         },
//         {
//             model: Review,
//             attributes: [],
//             subQuery: false
//         }
//     ]
//     })
//     res.json({spot})
// })

router.get('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id,{
        // attributes: {
        //                 include: [[Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating'],[Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),'numReviews']]
        //             }
    })
    const user = await User.findByPk(spot.ownerId)
    const spotImages = await SpotImage.findAll({
        where: { spotId: req.params.id},
        attributes: {
            exclude: ['spotId']
        }
    })
    const reviews = await Review.findAll({
        where: {spotId: req.params.id}
    })
    const numReviews = [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),'numReviews']
    const avgStar = [Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating']
    // const allSpots = {
    //     Spot: spot,
        // Spot: {
        // id: spot.id,
        // ownerId: spot.ownerId,
        // address: spot.address,
        // city: spot.address,
        // state: spot.state,
        // country: spot.country,
        // lat: spot.lat,
        // lng: spot.lng,
        // name: spot.name,
        // description: spot.description,
        // price: spot.price,
        // createdAt: spot.createdAt,
        // updatedAt: spot.updatedAt,
        // numReviews: numReviews,
        // avgStarRating: avgStar
        // },
        //User: user,
    // User: {
    //     id: user.id,
    //     firstName: user.firstName,
    //     lastName: user.lastName
    // },
    // SpotImages: spotimage
    // SpotImage: {
    //     spotImages
    // }
    //}
    const allSpots = {}
    allSpots.Spot = spot
    allSpots.Spot.avgStarRating = 4
    allSpots.Spot.numReviews = numReviews
    console.log(allSpots.Spot)
    res.json(allSpots.Spot)
})

//Create a spot
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
        return res.status(201).json({message: 'Successfully created', data: newSpot})
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

// router.post('/:id/images', async (req, res) => {
//     try {
//         const {id, url, preview } = req.body
//     }
//     catch {

//     }
// })

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id,{
        where: { ownerId: req.user.id }
    })
    if(!spot){
      return res.status(404).json({ message: 'Spot couldnt be found'})
    }
    await spot.destroy()
    res.json({ message: 'Successfully deleted'})
})

module.exports = router;
