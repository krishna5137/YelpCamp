const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const asyncError = require('./utils/asyncError');
const ExpressError = require('./utils/ExpressError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false // Make Mongoose use `findOneAndUpdate()`
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Mongo Connection Open");
});

const app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE/PUT
app.use(express.static(__dirname + '/public')); //static page content

//to-do
//Authentication

const sessionConfig = {
    secret: 'redo-in-prod!',
    resave: false,
    saveUninitialized: true,
    //store config redis/mongo for prod. def: uses memory store
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // setting session expiry for a week from now in milli s
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

app.use(session(sessionConfig));
app.use(flash());

// middleware to display flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
/**
 * define the campgrounds, reviews routes
 */
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

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
