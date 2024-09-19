const  slugify  = require("slugify");
const photoModel = require("../Models/photoModel");
const fs = require('fs');

module.exports.createPhotoController = async(req, res) => {
    try{
        const {name,slug} = req.fields;
        const {photo} = req.files;
        //Validation
        
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"});
                
            case photo && photo.size < 1024:
                return res.status(500).send({error: "Photo is required and should be less than 1mb"});
                
        }

        const photos = new photoModel({...req.fields, slug:slugify(name)});
        if(photo){
            photos.photo.data = fs.readFileSync(photo.path);
            photos.photo.contentType = photo.type;
        }
        await photos.save();
        res.status(201).send({
            success:true,
            message:"Photo Uploaded Successfully",
            photos,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Upload Photo",
            error
        })
    }
};


module.exports.getPhotoController = async(req, res) => {
    try{
        const photos = await photoModel.find({});
        res.status(200).send({
            success:true,
            message:"All Photos",
            photos,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting Products",
            error : error.message
        })
    }
};


module.exports.PhotoController = async(req, res) => {
    try{
        const photos = await photoModel.findById(req.params.pid).select("photo");
        if(photos.photo.data){
            res.set('content-type', photos.photo.contentType);
            return res.status(200).send(photos.photo.data);
        }
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting image",
            error
        })
    }
};

module.exports.deletePhotoController = async(req, res) => {
    try{
        await photoModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Photo Delete Successfully",
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Delete Photos",
            error
        })
    }
};