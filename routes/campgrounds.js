const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const { index, renderNewForm, createNewCampground, renderCampground, editCampground, deleteCampground, renderEditCampground } = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });




router.route('/')
    .get(index)
    .post(isLoggedIn, upload.array('images'), validateCampground, createNewCampground);

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
    .get(renderCampground)
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, editCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, renderEditCampground);


module.exports = router;