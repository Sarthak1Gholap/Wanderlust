const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// Show Review Route
router.post("/", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  const review = await Review.findById(reviewId);
  res.render("listings/show.ejs", { listing });
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`,{ listing });
}));

module.exports = router;
