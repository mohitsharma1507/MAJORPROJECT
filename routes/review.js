const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utilies/wrapAsync.js");
const ExpressError = require("../utilies/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}


// Reviews
// Post Review Route

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.postReview));

// Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;