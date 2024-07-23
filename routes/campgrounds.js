const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



// *********

//All Campgrounds

router.route('/')
    .get(catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds })
    }))
    .post(validateCampground, catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    }))


router.get('/new', (req, res) => {
    res.render('campgrounds/new')
});

router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate('reviews');
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    }))
    .put(validateCampground, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    }))
    .delete(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground');
        res.redirect('/campgrounds');
    }));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });

}));


module.exports = router;