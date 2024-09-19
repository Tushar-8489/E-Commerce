const JWT = require('jsonwebtoken');
const userModel = require('../Models/userModel');

//ProtectedRoute

module.exports.requiredSignIn = async(req, res, next) => {
    
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        //console.log(decode);
        req.user = decode;
        next();
    }catch(error){
        console.log(error);
    }
};

//Admin Accces
module.exports.isAdmin = async(req, res, next) => {
    try{
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:'Unauthorized Access'
            })
        }else{
            next();
        }
    }catch(error){
        console.log(error);
        res.status(401).send({
            success:true,
            error,
            message:"Error in admin middleware"
        })
    }
}