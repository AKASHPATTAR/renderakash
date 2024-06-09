const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");
const mongooseurl = 'mongodb://127.0.0.1:27017/wanderlusr';

main()
    .then(() => {
        console.log("connect to db");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(mongooseurl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "662becc41b67f2858d0ebb5d" }));
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
};
initDB();