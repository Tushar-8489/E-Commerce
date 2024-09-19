const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const connDB = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connection established to MongoDB ${connDB.connection.host}`);
    } catch(err){
        console.error(err);
    }
};

module.exports = connectDB;