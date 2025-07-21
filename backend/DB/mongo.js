const mongoose = require('mongoose');


function mongoDb() {
    const DB = process.env.MONGO_URI;
    if (!DB) {
        throw new Error("MONGO_URI environment variable is not set!");
    }
    mongoose.connect(DB).then(con => {
        console.log('MongoDB Connected Successfully!');
    }).catch(err => console.log('Error Connecting MongoDB: ', err.message));
}

module.exports = mongoDb;