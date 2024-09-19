const  categoryModel  = require("../Models/CategoryModel");
const slugify = require("slugify");

module.exports.createCategoryController = async(req, res) => {
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message : "Name is Required"});
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category is Already Created"
            })
        }
        const category = await  new categoryModel({name, slug:slugify(name)}).save();
            res.status(201).send({
            success:true,
            message:"New Category Created",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in Category"
        })
    }
};

module.exports.updateCategoryController = async(req, res) => {
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated Succesfully",
            category,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while updating Category"
        })
    }
};

module.exports.categoryController = async(req, res) => {
    try{
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All Category List",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting All Category'
        })
    }
};

module.exports.singleCategoryController  = async(req, res) => {
    try{
        const {slug} = req.params;
        const category = await categoryModel.findOne(slug);
        res.status(200).send({
            success:true,
            message:"Get single category succefully",
            category,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting Single Category'
        })
    }
};

module.exports.deleteCategoryController = async(req, res) => {
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted Succesfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while deleting category",
            error,
        })
    }
}