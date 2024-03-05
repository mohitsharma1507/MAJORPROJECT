const express =require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilies/wrapAsync.js");
const ExpressError = require("../utilies/ExpressError.js");
const { listingSchema } = require("../schema.js");
const router=express.Router();
const {isLoggedIn, isOwner} =require("../middleware.js");

const listingController = require("../controller/listings.js");

const multer  = require('multer')
const{storage} =require("../cloudinaryConfig.js");
const upload = multer({ storage }) //  for initialize the multer



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));




// New Route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.show))
.put( isLoggedIn, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

// Edit Route

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.edit)
);

module.exports = router;