const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const { createNewReview, deleteReview } = require('../controllers/reviews.js');


router.route('/')
    .post(isLoggedIn, validateReview, createNewReview);

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor,deleteReview)

module.exports = router;