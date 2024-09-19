const express = require("express");
const { requiredSignIn, isAdmin } = require("../Middleware/authMiddleware");

const formidable = require("express-formidable");
const { createPhotoController, getPhotoController, PhotoController, deletePhotoController } = require("../controllers/photoController");

const router  = express.Router();


router.post('/upload-photo', requiredSignIn, isAdmin, formidable(), createPhotoController);

router.get('/get-photo', getPhotoController);

router.get('/photo/:pid', PhotoController);

router.delete('/delete-photo/:pid', requiredSignIn, isAdmin, deletePhotoController);

module.exports = router;