const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt facere quas in voluptates beatae laudantium commodi quasi. Eaque similique commodi aut quia sunt adipisci accusamus non quidem eveniet, perspiciatis repellat? Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio repudiandae quod impedit et at quaerat incidunt ',
            price: Math.floor(Math.random() * 20) + 10
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})