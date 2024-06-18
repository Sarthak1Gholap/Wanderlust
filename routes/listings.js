const express = require("express");
const router = express.Router();
const listingControllers = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");

router.get("/", listingControllers.index);

router.get("/new", isLoggedIn, listingControllers.newForm);

router.get("/:id", listingControllers.show);

router.post("/", isLoggedIn, listingControllers.create);

router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.editForm);

router.put("/:id", isLoggedIn, isOwner, listingControllers.update);

router.delete("/:id", isLoggedIn, isOwner, listingControllers.delete);

module.exports = router;
