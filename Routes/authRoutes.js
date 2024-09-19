const express = require('express');
const {registerController, loginController, forgotPasswordController, updateProfileController} = require('../controllers/authController');
const {requiredSignIn} = require('../Middleware/authMiddleware');

//router object

const router = express.Router();
//routing
//Rgister || Method post
router.post('/register', registerController);

//Login \\ post

router.post('/login', loginController);

//Forgot Password
router.post('/forgot-password', forgotPasswordController);

//Protected Routes

router.get('/user/dashboard', requiredSignIn, (req, res) => {
    res.status(200).send({ ok : true});
});

//Update Profile
router.put('/profile', requiredSignIn, updateProfileController);

module.exports = router