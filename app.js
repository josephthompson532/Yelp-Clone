const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const Campground = require("./models/campground")
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync')

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch((err) => {
        console.log("OH NO ERROR!!")
        console.log(err)
    });

// I think the code directly above does the same thing as this commented out code.
// const db = mongoose.connection;
// db.on("error", console.error.bind(console,"connection error:"));
// db.once("open", () => {
//     console.log("Database connected")
// })

app.engine('ejs', ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
    res.render("home") 
});

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", { campgrounds })
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
    next(e)
}));

// delete this later
app.get("/makecampground", catchAsync(async (req, res) => {
    const camp = new Campground({title: 'My Backyard', description: "cheap camping"});
    await camp.save();
    res.send(camp)
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground)
    res.render("campgrounds/show", { campground })
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground})
}));

app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const {title, location } = req.body;
    await Campground.update({_id: id}, {title:title, location: location})
    res.redirect(`/campgrounds/${id}`)
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.deleteOne({_id: id});
    res.redirect("/campgrounds")
}))

app.use((err, req, res, next) => {
    res.send("Ohhhhh boy, something went wrong!")
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
});