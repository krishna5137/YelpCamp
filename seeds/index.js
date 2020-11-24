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
    for (let i = 0; i < 400; i++) {
        let rand1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor((Math.random() * 30) + 10);
        const camp = new CampGround({
            author: "5fb38fc98b0d311e395c4fbe",
            title: `${title(descriptors)} ${title(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/krish5137/image/upload/v1605778334/YelpCamp/lcsrrlmhjcbjf6vqbpnd.jpg',
                    filename: 'YelpCamp/lcsrrlmhjcbjf6vqbpnd'
                },

                {
                    url: 'https://res.cloudinary.com/krish5137/image/upload/v1605778336/YelpCamp/b1d06xjnhrbdlj9mqzbx.jpg',
                    filename: 'YelpCamp/b1d06xjnhrbdlj9mqzbx'
                }
            ],
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

