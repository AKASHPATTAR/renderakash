const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//new chnage in this line
const Review = require("./reviews.js")
const listingSchema = new Schema({
    title:
    {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    loctaion: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "reviews",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },


});
//new chang one line
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });

    }

});







//
const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;