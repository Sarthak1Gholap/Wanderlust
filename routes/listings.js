const express = require("express");
const router = express.Router();
const listingControllers = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer  = require('multer');
const{ storage } = require("../cloudconfig.js");
const wrapAsync = require("../utils/wrapAsync.js");
const upload = multer({ storage});

router.get("/", listingControllers.index);

router.get("/new", isLoggedIn, listingControllers.newForm);

router.get("/:id", listingControllers.show);

router.post("/", isLoggedIn, upload.single('listing[image]'),validateListing,listingControllers.create);
// isLoggedIn, upload.single('listing[image]')
// router.post("/",isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync
// ((req,res)=>{
//     console.log(req.body.listing)
// }))

// router.post("/", upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// });

router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.editForm);

router.put("/:id", isLoggedIn, isOwner, listingControllers.update);

router.delete("/:id", isLoggedIn, isOwner, listingControllers.delete);

module.exports = router;


//ta edit

// const express = require("express");
// const router = express.Router();
// const Listing = require("../models/listing.js");
// const wrapAsync = require("../utils/wrapAsync.js");
// const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// const listingController = require("../controllers/listings.js");
// const multer = require('multer');
// const { storage } = require("../cloudConfig.js");
// const upload = multer({ storage });


// //Index and Create Route
// router.route("/")
//     .get(wrapAsync(listingController.index))
//     .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


// //New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// //Show Route , Update Route, delete Route
// router.route("/:id")
//     .get(wrapAsync(listingController.showListing))
//     .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
//     .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// //Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// module.exports = router;