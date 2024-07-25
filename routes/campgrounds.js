const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');




router.route('/')
    .get(catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }))
    .post(isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    }))


router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')
});

router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate([{ path: 'reviews', populate: 'author' }, 'author']);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    }))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    }))
    .delete(isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground');
        res.redirect('/campgrounds');
    }));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}));


module.exports = router;