const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  res.render("error.ejs");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
