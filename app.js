const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const Campground = require("./models/campground")
const methodOverride = require('method-override')

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

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", { campgrounds })
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const { title, location } = req.body;
    const campground = new Campground({title: title,location: location});
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
});

// delete this later
app.get("/makecampground", async (req, res) => {
    const camp = new Campground({title: 'My Backyard', description: "cheap camping"});
    await camp.save();
    res.send(camp)
});

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findOne({_id: id})
    res.render("campgrounds/show", { camp })
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground})
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const {title, location } = req.body;
    await Campground.update({_id: id}, {title:title, location: location})
    res.redirect(`/campgrounds/${id}`)
})

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.deleteOne({_id: id});
    res.redirect("/campgrounds")
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
});