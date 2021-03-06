const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/config');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingService = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // forward geocoding to generate lat, long.
    const geoLocation = await geocodingService.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoLocation.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('author'); // populate across multiple levels
    if (!campground) {
        req.flash('error', 'Requested Campground doesn\'t exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); // remove from cloud
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) // remove from server
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.destroyCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deletion successful!');
    res.redirect('/campgrounds');
}