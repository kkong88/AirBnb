const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot } = require("../../db/models");
const { User } = require("../../db/models");
const { Review } = require("../../db/models");
const { SpotImage } = require("../../db/models");
const { reviewImage } = require("../../db/models");
const { Booking } = require('../../db/models')
const { check } = require("express-validator");
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
  check("stars")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("Must be a number between 1 to 5"),
  handleValidationErrors,
];

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

// Get all spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT url FROM spotImages WHERE spotId = Spot.id AND preview = true)`
          ),
          `previewImage`,
        ],
        [
          sequelize.literal(
            `(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`
          ),
          "avgStarRating",
        ],
      ],
    },
  });
  res.json({ spots });
});
// Get current users
router.get("/current", requireAuth, async (req, res) => {
  const Spots = await Spot.findAll({
    where: { ownerId: req.user.id },
  });
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
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(id) FROM Reviews WHERE spotId = Spot.id)`
          ),
          "numReviews",
        ],
        [
          sequelize.literal(
            `(SELECT AVG(star) FROM Reviews WHERE spotId = Spot.id)`
          ),
          "avgStarRating",
        ],
      ],
    },
    include: [{ model: User, as: "Owner" }],
  });
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }
  const spotImages = await SpotImage.findAll({
    where: { spotId: req.params.id },
  });
  spot.dataValues.SpotImages = spotImages;
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
  res.json({ message: "Successfully deleted" });
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
  const { review, stars } = req.body;
  let spot = await Spot.findByPk(req.params.id, {
    include: { model: Review },
  });
  if (!spot) {
      res.status(404).json({ message: "Spot couldnt be found", statusCode: 404 });
  }
  const findReview = await Review.findOne({
    where: {userId: req.user.id}
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
    star: stars,
  });
  res.json(spotReview);
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
      checkBooking.push(ele)
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
  if(!spot){
    return res
    .status(404)
    .json({message: "Spot couldn't be found", statusCode: 404})
  }
  if(spot.userId !== req.userId){
    return res.status(403),json({message: 'Forbidden'})
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
  res.json(resObj)
})



module.exports = router;
