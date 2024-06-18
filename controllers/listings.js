const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const { isloggedin } = require("../middleware");
const { isowner } = require("../middleware");

module.exports.index = wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = wrapAsync(async (req, res) => {
    console.log("REQ RECEIVED")
    
    res.render("listings/show.ejs");
});

module.exports.create = wrapAsync(async (req, res) => {
    listingSchema.validate(req.body);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
});

module.exports.editForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are trying to access does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
});

module.exports.update = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
});

module.exports.delete = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
});
