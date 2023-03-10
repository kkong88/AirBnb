const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot } = require("../../db/models");
const { User } = require("../../db/models");
const { Review } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { reviewImage } = require("../../db/models");
const { Booking } = require('../../db/models')
const { check, body } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const sequelize = require("sequelize");
const review = require("../../db/models/review");
const spotimage = require("../../db/models/spotimage");
const { JsonWebTokenError } = require("jsonwebtoken");
const user = require("../../db/models/user");
const e = require("express");
const { NUMBER } = require("sequelize");
const router = express.Router();

const validSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is require"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal({ checkFalsy: true })
    .toFloat()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal({ checkFalsy: true })
    .toFloat()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isDecimal({ checkFalsy: true })
    .toFloat()
    .notEmpty()
    .withMessage("Price is required"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review must contain text"),
  check("star")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Must be a number between 1 to 5"),
  handleValidationErrors,
];

const queryValidate = [
  check('page')
    .if(check('page').exists())
    .isInt({min: 1})
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .if(check('size').exists())
    .isInt({min: 1})
    .withMessage('Size must be greater than or equal to 1'),
  check('maxLat')
   .if(check('maxLat').exists())
   .isFloat({min: -90, max: 90})
   .withMessage('Maximum latitude is invalid'),
  check('minLat')
   .if(check('minLat').exists())
   .isFloat({min: -90, max: 90})
   .withMessage('Minimum latiude is invalid'),
  check('maxLng')
   .if(check('maxLat').exists())
   .isFloat({min:-180, max:180})
   .withMessage('Maximum longitude is invalid'),
  check('minLng')
   .if(check('minLng').exists())
   .isFloat({min:-180, max:180})
   .withMessage('Mininum longitude is invalid'),
  check('maxPrice')
   .if(check('maxPrice').exists())
   .isFloat({min:0})
   .withMessage('Minimum price must be greater than or equal to 0'),
handleValidationErrors
]

// const bookingValidate = [
//   check('startDate')
//    .exists({checkFalsy: true})
//    .notEmpty()
//    .isAfter(new Date())
//    .withMessage('Can not create booking in the past'),
//   check('endDate')
//    .exists({checkFalsy: true})
//    .notEmpty(),
//   handleValidationErrors
// ]

//Get all spots with query parameter
router.get('/', queryValidate, async (req, res)=> {
  let { page, size, maxLat, minLat, maxLng,minLng, minPrice, maxPrice } = req.query
  let where = {}
  page = parseInt(page)
  size = parseInt(size)
  if(Number.isNaN(page) || page < 0) page = 1
  if(Number.isNaN(size) || size > 20) size = 20
  if(maxLng) where.lng = {[Op.lte]: maxLng}
  if(minLng) where.lng = {[Op.gte]: minLng}
  if(maxLat) where.lat = {[Op.gte]: maxLat}
  if(minLat) where.lat = {[Op.Lte]: minLat}
  if(minPrice) where.price = {[Op.gte]: minPrice}
  if(maxPrice) where.price = {[Op.lte]: maxPrice}

  const spots = await Spot.findAll({
    where,
    // attributes: {
    //   // include:
    //   //   [[sequelize.literal(`(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`),
    //   //     `previewImage`,]],
    //   // exclude: [['avgStarRating']]
    //     },
        limit: size,
        offset: size * (page - 1)
  })
  for await (let spot of spots){
    const image = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })
    if(image){
      spot.dataValues.previewImage = image.url
    } else {
      spot.dataValues.previewImage = 'No preview image'
    }
    const reviews = await Review.findAll({
      where: {spotId: spot.id}
    })
    //console.log(reviews)
    let sum = 0
    if(reviews.length){
    reviews.forEach(review =>{
      //console.log(review)
      sum += Number(review.dataValues.star)
    })
    spot.dataValues.avgStarRating = sum/reviews.length
  } else {
    spot.dataValues.avgStarRating = 0
  }
  }

res.json({Spot: spots, page, size})
})

// Get all spots
// router.get("/", async (req, res) => {
//   const spots = await Spot.findAll({
//     attributes: {
//       include: [
//         [
//           sequelize.literal(
//             `(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`
//           ),
//           `previewImage`,
//         ],
//         [
//           sequelize.literal(
//             `(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`
//           ),
//           "avgStarRating",
//         ],
//       ],
//     },
//   });
//   res.json({ spots });
// });

// Get current users
router.get("/current", requireAuth, async (req, res) => {
  const Spots = await Spot.findAll({
    where: { ownerId: req.user.id },
  });
  for await (let spot of Spots){
    const image = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })
    if(image){
      spot.dataValues.previewImage = image.url
    } else {
      spot.dataValues.previewImage = 'No preview image'
    }
    const reviews = await Review.findAll({
      where: {spotId: spot.id}
    })
    //console.log(reviews)
    let sum = 0
    if(reviews.length){
    reviews.forEach(review =>{
      //console.log(review)
      sum += Number(review.dataValues.star)
    })
    spot.dataValues.avgStarRating = sum/reviews.length
  } else {
    spot.dataValues.avgStarRating = 0
  }
  }
  res.json({ Spots });
});

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
    // attributes: {
    //   include: [
    //     [
    //       sequelize.literal(
    //         `(SELECT COUNT(id) FROM Reviews WHERE spotId = Spot.id)`
    //       ),
    //       "numReviews",
    //     ],
    //     [
    //       sequelize.literal(
    //         `(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`
    //       ),
    //       "avgStarRating",
    //     ],
    //   ],
    // },
    include: [{ model: User, as: "Owner",
  attributes: {exclude: ['username','email','hashedPassword','createdAt','updatedAt']} }, {model: SpotImage,
      attributes: {exclude: ['spotId','createdAt','updatedAt']}}],
  });
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }
  const reviews = await Review.findAll({
    where: { spotId: spot.id}
  })
  spot.dataValues.numReviews = reviews.length
  // for await (let spot of spots){
  //   const spotImages = await SpotImage.findAll({
  //     where: { spotId: req.params.id },
  //   });
  //   spot.dataValues.SpotImages = spotImages;
  //   const reviews = await Review.findAll({
  //     where: {spotId: spot.id}
  //   })
  //   //console.log(reviews)
    let sum = 0
    if(reviews.length){
      reviews.forEach(review =>{
        //console.log(review)
      sum += Number(review.dataValues.star)
    })
    spot.dataValues.avgStarRating = sum/reviews.length
  } else {
    spot.dataValues.avgStarRating = 0
  }
  // }
  res.json(spot);
});

//Create a spot
router.post("/", validSpot, requireAuth, async (req, res) => {
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    ownerId,
  } = req.body;

  const newSpot = await Spot.create({
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
  });
  return res.status(201).json(newSpot);
});
//add image by id
router.post("/:id/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  let spot = await Spot.findByPk(req.params.id);
  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  spot = await SpotImage.create({
    spotId: req.params.id,
    url: url,
    preview: preview,
  });
  const resObj = {
    id: spot.id,
    url: spot.url,
    preview: spot.preview,
  };
  res.json(resObj);
});

// delete spot by id
router.delete("/:id", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.id, {
    where: { ownerId: req.user.id },
  });
  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  await spot.destroy();
  return res.json(spot);
});

// update/edit spot by id
router.put("/:spotId", requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot not found", statusCode: 404 });
  }
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
  });
  await spot.save();
  res.json(spot);
});

// get reviews by id
router.get("/:id/reviews", async (req, res) => {
    const reviews = await Review.findAll({
        where: { spotId: req.params.id },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: reviewImage,
                attributes: {
                    exclude: ["reviewId", "createdAt", "updatedAt"],
                },
            },
        ],
   });
  if (!reviews.length) {
   return res
      .status(404)
      .json({ message: "Spot couldn't be found", statusCode: 404 });
  }
 return res.json({ reviews });
});

//post review by id
router.post("/:id/reviews", validateReview, requireAuth, async (req, res) => {
  const { review, star } = req.body;
  let spot = await Spot.findByPk(req.params.id, {
    include: { model: Review },
  });
  if (!spot) {
      res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  const findReview = await Review.findOne({
    where: {userId: req.user.id},
    include: [{
      model: Spot,
      where: { id: req.params.id }
  }]
  })
  if (findReview) {
   return res
      .status(403)
      .json({
        message: "User already has a review for this spot",
        statusCode: 403,
      });
  }
  let spotReview = await Review.create({
    userId: req.user.id,
    spotId: Number(req.params.id),
    review: review,
    star: star,
  });
  return res.json(spotReview);
});

//Get all bookings for a spot based on spot id
router.get('/:id/bookings', requireAuth, async (req,res)=>  {
  const spot = await Spot.findByPk(req.params.id)
  if(!spot){
    return res
    .status(404)
    .json({ message: "Spot couldn't be found", statusCode:404})
  }
  const booking = await Booking.findAll({
    where: {spotId: spot.id},
    include: { model:User, attributes:{ exclude: ['username','email','hashedPassword','createdAt','updatedAt'] }}
  })
  const checkBooking = []
  booking.forEach(ele => {
    if(ele.userId === req.user.id){
      checkBooking.push({
        id: ele.id,
        spotId: ele.spotId,
        userId: ele.userId,
        startDate: ele.startDate.toISOString().slice(0,10),
        endDate: ele.endDate.toISOString().slice(0,10),
        createdAt: ele.createdAt,
        updatedAt: ele.updatedAt
      })
    } else {
      checkBooking.push({
        spotId: ele.spotId,
        startDate: ele.startDate.toISOString().slice(0,10),
        endDate: ele.endDate.toISOString().slice(0,10)
      })
    }
  })
  res.json({Bookings:checkBooking})
})

//create a booking from a spot based on spot id
router.post('/:id/bookings', requireAuth, async (req,res) =>{
  const spot = await Spot.findByPk(req.params.id,{
    include: { model: Booking }
  })
  if(!spot){
    return res
    .status(404)
    .json({message: "Spot couldn't be found", statusCode: 404})
  }
  const { startDate, endDate } = req.body
  if(startDate > endDate){
   return res.status(400).json({message: "Validation error", statusCode:400, errors: ["endDate cannot be on or before startDate"]})
  }
  spot.Bookings.forEach(booking => {
    let currentDate = booking.startDate.toISOString().slice(0,10)
    if(currentDate === startDate){
    return res.status(403).json({message: "Sorry, this spot is already booked for the specified dates",statusCode:403, errors: ["Start date conflicts with an existing booking",
      "End date conflicts with an existing booking"]})
    }
  })
  if(spot.userId !== req.userId){
    return res.status(403).json({message: 'Forbidden'})
  }
  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId: Number(req.params.id),
    startDate: startDate,
    endDate: endDate
  })
  let resObj = {
    id: newBooking.id,
    userId: newBooking.userId,
    spotId: newBooking.spotId,
    startDate: newBooking.startDate.toISOString().slice(0,10),
    endDate: newBooking.endDate.toISOString().slice(0,10)
  }
  console.log(resObj)
  res.json(resObj)
})


// router.get('/', queryValidate, async (req, res)=> {
//   let { page, size, maxLat, minLat, maxLng, minPrice, maxPrice } = req.query
//   let where = {}
//   page = parseInt(page)
//   size = parseInt(size)
//   if(Number.isNaN(page) || page < 0) page = 1
//   if(Number.isNaN(size) || size > 20) size = 20
//   if(maxLng) where.lng = {[Op.lte]: maxLng}
//   if(minLng) where.lng = {[Op.gte]: minLng}
//   if(maxLat) where.lat = {[Op.gte]: maxLat}
//   if(minLat) where.lat = {[Op.Lte]: minLat}
//   if(minPrice) where.price = {[Op.gte]: minPrice}
//   if(maxPrice) where.price = {[Op.lte]: maxPrice}

//   const spots = await Spot.findAll({
//     where,
//     attributes: {
//       include:
//         [sequelize.literal(`(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`),
//           `previewImage`,],
//       exclude: [['avgStarRating']]
//         },
//         limit: size,
//         offset: size * (page - 1)
//   })


// res.json({Spot: spots, page, size})
// })

module.exports = router;
