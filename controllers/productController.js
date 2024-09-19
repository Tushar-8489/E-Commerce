const  slugify  = require("slugify");
const productModel = require("../Models/productModel");
const fs = require('fs');

module.exports.createProductController = async(req, res) => {
    try{
        const {name,slug,description,price,category,quantity,shipping,off,oldPrice} = req.fields;
        const {photo,image1,image2,image3} = req.files;
        //Validation
        
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"});
            case !description:
                return res.status(500).send({error:"Description is Required"});
            case !price:
                return res.status(500).send({error:"Price is Required"});
            case !category:
                return res.status(500).send({error:"Category is Required"});
            case !quantity:
                return res.status(500).send({error:"Quantity is Required"});
                
            case photo && photo.size < 1024:
                return res.status(500).send({error: "Photo is required and should be less than 1mb"});
                
        }

        const products = new productModel({...req.fields, slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
            
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product created Successfully",
            products,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Create Product",
            error
        })
    }
};

module.exports.getProductController = async(req, res) => {
    try{
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            totalCount : products.length,
            message:"All Products",
            products,
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


module.exports.getSingleProductController = async(req, res) => {
    try{
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Single Product Fetched",
            product
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while geeting Single product",
            error
        })
    }
};

module.exports.productPhotoController = async(req, res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set('content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
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

module.exports.deleteProductController = async(req, res) => {
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Product Delete Successfully",
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Delete Products",
            error
        })
    }
};

module.exports.updateProductController = async(req, res) => {
    try{
        const {name,slug,description,price,category,quantity,shipping,oldPrice,off} = req.fields;
        const {photo} = req.files;
        //Validation
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"});
            case !description:
                return res.status(500).send({error:"Description is Required"});
            
            case !price:
                return res.status(500).send({error:"Price is Required"});
            case !oldPrice:
                    return res.status(500).send({error:"Old Price is Required"});
            case !off:
                     return res.status(500).send({error:"Offer is Required"});
            case !category:
                return res.status(500).send({error:"Category is Required"});
            case !quantity:
                return res.status(500).send({error:"Quantity is Required"});
            case photo && photo.size > 1024:
                return res.status(500).send({error: "Photo is required and should be less than 1mb"});
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)},
            {new : true}
        );
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"Product updated Successfully",
            products,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Update Products",
            error
        })
    }
};

//product count 
module.exports.productCountController = async(req, res) => {
    try{
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            message:"Error in product Count",
            error,
            success:false
        })
    }
};

module.exports.productListController  = async(req,res) => {
    try{
        const perPage = 10;
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: - 1});
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in per page count",
            error
        })
    }
};

// Search Product
 module.exports.searchProductController = async(req, res) => {
    try{
        const{keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex : keyword, $options:"i"}},
                {description:{$regex : keyword, $options:"i"}}
            ]
        }).select('-photo');
        res.json(results);
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:'Error in Search product API',
            error,
        })
    }
 };

 //related Product
 module.exports.relatedProductController = async(req, res) => {
    try{
        const {pid, cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select("-photo").limit(3).populate("category");
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error while getting related product",
            error
        })
    }
 }