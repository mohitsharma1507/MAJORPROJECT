const Listing =require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken= "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const geocodingClient =mbxGeocoding({ accessToken:maptoken });


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
};                                                                     

module.exports.show= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing u requested for  does not exits");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.create=async (req, res, next) => {
   let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1
    })
        .send()

    

   let url= req.file.path;
   let filename= req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url ,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    res.redirect("/listings");
};

module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        res.redirect("/listings")
    }

    let originalImageUrl= listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/w_150");
    res.render("listings/edit.ejs", { listing ,originalImageUrl });
};

module.exports.update=async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image ={url,filename};
    await listing.save();
    }
    res.redirect("/listings");
};

module.exports.delete=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted")
    res.redirect("/listings");
};

