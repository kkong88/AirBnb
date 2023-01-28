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

router.delete('/:id', requireAuth, async (req,res)=> {
    const review = await reviewImage.findByPk(req.params.id, {
        where: { reviewId: req.user.id}
    })
    if(!review){
        return res.status(404).json({message: "Review Image couldn't be found", statusCode:404})
    }
    await review.destroy()
    res.json({message: "Successfully deleted", statusCode:200})
})

module.exports = router;
