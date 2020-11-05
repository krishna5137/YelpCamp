const express = require('express');
const path = require('path')
const mongoose = require('mongoose');

const CampGround = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Mongo Connection Open");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.render('home')
})

// /campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/show', { campground });
})

app.listen(8080, () => {
    console.log('Serving on port 8080')
})