const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const { descriptors, places } = require('./helpers');
const cities = require('./cities');

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

const title = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await CampGround.deleteMany({});
    for (let i = 0; i < 100; i++) {
        let rand1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor((Math.random() * 30) + 10);
        const camp = new CampGround({
            title: `${title(descriptors)} ${title(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est recusandae voluptatibus quas dolorum sequi labore, error unde, sunt earum quisquam et facilis, temporibus quis optio reiciendis cupiditate! Delectus, expedita tenetur!",
            price
        });
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    });

