if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User =require("./models/user.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilies/wrapAsync.js");
const ExpressError = require("./utilies/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");
const user= require("./routes/user.js");
const session = require("express-session");
const MongoStore =require("connect-mongo");
const flash =require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const { log } = require('console');




app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLAS_URL;

main().then((res) => {
    console.log("successfull");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 3600,
});


store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    },

};

// app.get("/", (req, res) => {
//     res.send("successfully")
// });





app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser =req.user;
    next();
});



// app.use("/demouser",async(req,res)=>{
//     let  fakeUser=new User({
//         email:"jojo@456gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser=await User.register(fakeUser,"hellojojo");
//     res.send(registeredUser);
// })

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// }
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// }

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

app.use("/",user);

// // Index Route

// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// })
// );


// // New Route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs")
// });


// // Show Route

// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// })
// );

// // Create Route

// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// })
// );

// // Edit Route

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// })
// );

// // Update Route

// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect("/listings");
// })
// );

// // Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// })
// );

// // Reviews
// // Post Review Route

// app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
//     let listing =await Listing.findById(req.params.id);
//     let newReview = new Review (req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// }));

// // Delete Reviews Route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id ,reviewId }=req.params;

//     await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
//    await Review.findById(reviewId);

//    res.redirect(`/listings/${id}`);
// }));



// app.get("/testlisting",(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new vila ",
//         description:"Near to beach area",
//         price:9500000,
//         location:"Goa",
//         country:"India",
//     });

//     sampleListing.save().then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     })

// })


// Middleware Adding

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    // res.send("something went wrong ")
    res.status(status).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("serving is working now");
});
