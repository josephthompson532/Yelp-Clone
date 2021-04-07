
const path = require("path")
const mongoose = require("mongoose");
const Campground = require("../models/campground")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// I think the code directly above does the same thing as this commented out code.
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i< 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam, assumenda recusandae consectetur, necessitatibus pariatur eveniet iste fugiat ducimus et soluta tenetur nostrum, ipsum labore qui reprehenderit ipsam rem minus aut.",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log("CLOSING CONNECTION")
    mongoose.connection.close()
})