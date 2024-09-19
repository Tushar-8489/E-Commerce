const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    photo:{
        data:Buffer,
        contentType:String
    },
    name:{
        type:String,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model("photos", photoSchema);