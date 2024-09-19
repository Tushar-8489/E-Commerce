const { hashPassword, comparedPassword } = require("../Helper/authHelper");
const userModel = require("../Models/userModel");
const JWT = require('jsonwebtoken');
const { use } = require("../Routes/photoRoutes");


module.exports.registerController = async(req, res) => {
    try{
        const {name, email, password, phone,answer} = req.body;
        //validation
        if(!name){
            return res.send({message:'Name is required'});
        }
        if(!email){
            return res.send({message:'Email is required'});
        }
        if(!password){
            return res.send({message:'Password is required'});
        }
        if(!phone){
            return res.send({message:'Phone is required'});
        }
        if(!answer){
            return res.send({message:'Answer is required'});
        }

        //check user
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already Register Please Login",
            })
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({name,email,phone,password:hashedPassword,answer}).save();
        res.status(201).send({
            success:true,
            message:'User Registration Succesfully',
            user,
        });

    }catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}

//Post Login

module.exports.loginController = async(req, res) => {
    try{
        const {email, password} =  req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email or Password"
            })
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not Registerd'
            })
        }
        const match = await comparedPassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d",});
        res.status(200).send({
            success:true,
            
            message:'Login Successful',
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                
                
            },
            token,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error
        })
    }
};


module.exports.forgotPasswordController = async(req, res) => {
    try{
        const{email,answer,newPassword} = req.body;
        if(!email){
            res.status(400).send({message: 'Email is Required'});
        }
        if(!answer){
            res.status(400).send({message: 'Answer is Required'});
        }
        if(!newPassword){
            res.status(400).send({message: 'New Password is Required'});
        }
        //check
        const user = await userModel.findOne({email,answer});
        //validation
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'Wrong Email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashed});
        res.status(200).send({
            success:true,
            message : "Password Reset Successfully",
        });
    }catch(error){
        console.log(error);;
        res.status(500).send({
            success:false,
            message: "Something went Wrong",
            error
        })
    }

};


module.exports.updateProfileController = async(req, res) => {
    try{
        const {name,email,password,address,phone} = req.body;
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 6){
            return res.json({error: "Password is required and 6 character long"});
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password : hashedPassword || user.password,
            phone : phone || user.phone,
            address : address || user.address,
        },{new:true});
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        })
    }catch(error){
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error while Update Profile",
            error
        })
    }
}

//module.exports =  {registerController}