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
const { JsonWebTokenError } = require('jsonwebtoken');
const router = express.Router();

const validSpot = [
    check('address')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Street address is require'),
    check('city')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy:true})
        .notEmpty()
        .isDecimal({checkFalsy:true})
        .toFloat()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy:true})
        .notEmpty()
        .isDecimal({checkFalsy:true})
        .toFloat()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .notEmpty()
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({checkFalsy:true})
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({checkFalsy: true})
        .isDecimal({checkFalsy: true})
        .toFloat()
        .notEmpty()
        .withMessage('Price is required'),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Review must contain text'),
    check('star')
        .exists({checkFalsy:true})
        .notEmpty()
        .isInt({min: 1, max: 5})
        .withMessage('Must be a number between 1 to 5'),
    handleValidationErrors
]

// Get all spots
router.get('/', async(req,res)=>{
    const spots = await Spot.findAll({
        attributes: {
        include:[
            [sequelize.literal(`(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`),`previewImage`],
            [sequelize.literal(`(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`),"avgStarRating"]
        ],

        }
    })
    res.json({spots})
})
// Get current users
router.get('/current', requireAuth, async (req, res) => {
    const current = await Spot.findAll({
        where: { ownerId: req.user.id }
    })
    res.json({current})
})

//Get details of a spot from an id
// router.get('/:id', async (req, res) => {
//     const spotId = req.params.id
//     const spotImage = await SpotImage.findAll({
//         where: { spotId: spotId },
//         attributes:
//             ['id','image', 'preview']
//     })
//     const spot = await Spot.findByPk(spotId, {
//         attributes: {
//             include: [[sequelize.fn('AVG', sequelize.col('Reviews.star')),'avgStarRating'],[sequelize.fn('COUNT', sequelize.col('Reviews.id')),'numReviews']]
//         },
//         include: [
//             {
//                 model: User,
//                 as: 'Owner',
//                 attributes: ['id', 'firstName', 'lastName']
//             },
//             {
//                 model: SpotImage,
//                 attributes: ['spotId','image']
//             },
//             {
//                 model: Review,
//                 attributes: [],
//                 subQuery: false
//             }
//         ]
//     })
//     spot.dataValues.SpotImages = spotImage
//     res.json({spot})
// })

// router.get('/:id', async (req, res) => {
//     const spot = await Spot.findByPk(req.params.id,{
//         // attributes: {
//         //   include: [[Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating'],[Sequelize.fn('COUNT', Sequelize.col('Reviews.id')),'numReviews']]
//         //             }
//     })
//     const user = await User.findByPk(spot.ownerId)
//     const spotImages = await SpotImage.findAll({
//         where: { spotId: req.params.id},
//         attributes: {
//             exclude: ['spotId']
//         }
//     })
//     const reviews = await Review.findAll({
//         where: {spotId: req.params.id}
//     })
//     const numReviews = reviews.length
//     const avgStar = [Sequelize.fn('AVG', Sequelize.col('Reviews.star')),'avgStarRating']
//     console.log(avgStar)
//     // const allSpots = {
//     //     Spot: spot,
//         // Spot: {
//         // id: spot.id,
//         // ownerId: spot.ownerId,
//         // address: spot.address,
//         // city: spot.address,
//         // state: spot.state,
//         // country: spot.country,
//         // lat: spot.lat,
//         // lng: spot.lng,
//         // name: spot.name,
//         // description: spot.description,
//         // price: spot.price,
//         // createdAt: spot.createdAt,
//         // updatedAt: spot.updatedAt,
//         // numReviews: numReviews,
//         // avgStarRating: avgStar
//         // },
//         //User: user,
//     // User: {
//     //     id: user.id,
//     //     firstName: user.firstName,
//     //     lastName: user.lastName
//     // },
//     // SpotImages: spotimage
//     // SpotImage: {
//     //     spotImages
//     // }
//     //}
//     const allSpots = {}
//     allSpots.Spot = spot
//     //console.log(allSpots.Spot,'!!!!!!!!!!!!!!!!!!!!!!!!!!!')
//     allSpots.Spot.dataValues.avgStarRating = Number(avgStar[0].avg)
//     allSpots.Spot.dataValues.numReviews = numReviews
//     //console.log(allSpots.Spot.dataValues)
//     res.json(allSpots.Spot)
// })

// get spot by id
router.get("/:id", async (req, res) => {
    const spot = await Spot.findOne({
        where: { id: req.params.id },
        attributes: {
            include: [
                [sequelize.literal(`(SELECT COUNT(id) FROM Reviews WHERE spotId = Spot.id)`), "numReviews"],
                [sequelize.literal(`(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`),"avgStarRating"]
            ]
        },
        include: [{model:SpotImage}, {model: User, as: 'Owner'}]
    })
    res.json(spot)
})

//Create a spot
router.post('/', validSpot, requireAuth, async (req, res) => {
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
})
//add image by id
router.post('/:id/images', requireAuth, async (req, res) => {
        const { url, preview } = req.body
        let spot = await Spot.findByPk(req.params.id)
        spot = await SpotImage.create(
            {
                url: url,
                preview: preview
     })
     if(!spot){
        res.status(404).json({message: 'Spot couldnt be found'})
     }
     res.json(spot)
})
// delete spot by id
router.delete('/:id', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id,{
        where: { ownerId: req.user.id }
    })
    if(!spot){
      return res.status(404).json({ message: 'Spot couldnt be found'})
    }
    await spot.destroy()
    res.json({ message: 'Successfully deleted'})
})
// update/edit spot by id
router.put('/:spotId', requireAuth, async (req,res)=> {
    const {address, city, state, country, lat, lng, name, description, price} = req.body
    let spot = await Spot.findByPk(req.params.spotId)
    spot.update({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
    })
    if(!spot){
        res.status(404).json({message: "Spot not found"})
    }
    await spot.save()
    res.json(spot)
})

// get reviews by id
router.get('/:id/reviews', async (req,res) => {
    const reviews = await Review.findByPk(req.params.id,{
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName']
            },{
            model: reviewImage,
            attributes: {
                exclude: ['reviewId','createdAt','updatedAt']
            }
            }
        ]
    })
    if(!reviews){
        res.status(404).json({message: "Spot couldn't be found"})
    }
    res.json({reviews})
})

//post review by id
router.post('/:id/reviews', async (req,res)=>{
  const { review, star } = req.body
  let spotReview = await Spot.findByPk(req.params.id)
  spotReview = await Review.create(
    {
        review: review,
        star: star
    })
    if(!spotReview){
        res.status(404).json({message: 'Spot couldnt be found'})
    }
    res.json(spotReview)
})

module.exports = router;
