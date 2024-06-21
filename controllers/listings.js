const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const { isloggedin } = require("../middleware");
const { isowner } = require("../middleware");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingCLient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

module.exports.newForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ExpressError(400, "Empty or invalid listing id");
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
    return;
  }
  res.render("listings/show.ejs", { listing });
});

module.exports.create = wrapAsync(async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const coordinate = await geoCodingCLient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let newListing = new Listing(req.body.listing);
  newListing.geometry = coordinate.body.features[0].geometry;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  const newListingLOG = await newListing.save();

  console.log("NEW LISTING CREATED::::::::::::", newListingLOG);

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

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
});

module.exports.update = wrapAsync(async (req, res) => {
  let { id } = req.params;

  console.log(":::REQ BODY::::", req.body);

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  console.log("UPDATED:::::::", listing);

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

module.exports.delete = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
});

//ta code

//  const Listing = require("../models/listing");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// //Index
// module.exports.index = async (req, res, next) => {
// 	const allListing = await Listing.find({});
// 	res.render("listings/index.ejs", { allListing });
// };

// //New Liting
// module.exports.renderNewForm = (req, res) => {
// 	res.render("listings/new.ejs");
// };

// //show Listing
// module.exports.showListing = async (req, res) => {
// 	let { id } = req.params;
// 	const listing = await Listing.findById(id)
// 		.populate({
// 			path: "reviews",
// 			populate: { path: "author" },
// 		})
// 		.populate("owner");
// 	if (!listing) {
// 		req.flash("error", "Listing you requested for does not exist!");
// 		res.redirect("/listings");
// 	}
// 	console.log(listing);
// 	res.render("listings/show.ejs", { listing });
// };

// //Create Listing

// module.exports.createListing = async (req, res, next) => {
// 	let response = await geocodingClient
// 		.forwardGeocode({
// 			query: req.body.listing.location,
// 			limit: 2,
// 		})
// 		.send();

// 	let url = req.file.path;
// 	let filename = req.file.filename;
// 	const newListing = new Listing(req.body.listing);
// 	newListing.owner = req.user._id;
// 	newListing.image = { url, filename };

// 	newListing.geometry = response.body.features[0].geometry;

// 	let savedListing = await newListing.save();
// 	console.log(savedListing);
// 	req.flash("success", "New Listing Created!");
// 	res.redirect("/listings");
// };

// //Edit Listing
// module.exports.renderEditForm = async (req, res, next) => {
// 	let { id } = req.params;
// 	const listing = await Listing.findById(id);
// 	if (!listing) {
// 		req.flash("error", "Listing you requested for does not exist!");
// 		res.redirect("/listings");
// 	}

// 	let originalImageUrl = listing.image.url;
// 	originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
// 	res.render("listings/edit.ejs", { listing, originalImageUrl });
// };

// //Update Listing
// module.exports.updateListing = async (req, res, next) => {
// 	let { id } = req.params;
// 	let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

// 	if (typeof req.file !== "undefined") {
// 		let url = req.file.path;
// 		let filename = req.file.filename;
// 		listing.image = { url, filename };
// 		await listing.save();
// 	}

// 	req.flash("success", "Listing Updated!");
// 	res.redirect(`/listings/${id}`);
// };

// //Delete Listing
// module.exports.deleteListing = async (req, res, next) => {
// 	let { id } = req.params;
// 	const deletedListing = await Listing.findByIdAndDelete(id);
// 	console.log(deletedListing);
// 	req.flash("success", "Listing Deleted!");
// 	res.redirect("/listings");
// };
