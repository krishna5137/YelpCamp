const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate');
const asyncError = require('./utils/asyncError');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./validateSchemas.js');

const CampGround = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Mongo Connection Open");
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('useFindAndModify', false); // Make Mongoose use `findOneAndUpdate()`.

app.use(morgan('dev'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE/PUT

/**
 * Server-side validation
 */
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', asyncError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


app.post('/campgrounds', validateCampground, asyncError(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id/edit', asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.get('/campgrounds/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render('campgrounds/show', { campground });
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal Server Error';
    res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
    console.log('Serving on port 8080')
});
