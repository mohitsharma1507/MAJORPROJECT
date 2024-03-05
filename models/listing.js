const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review =require("./review");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,ref:"Review"
    },
],
    owner:{
        type:Schema.Types.ObjectId,ref:"User"
    },

    geometry : {
        type: {
          type: String,
          enum: ["Point"], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
    });

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing) { 
    await Review.deleteMany({Reviews :{$in: listing.reviews}});
    }
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports = Listing;