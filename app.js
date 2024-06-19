require('dotenv').config();
console.log(process.env);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//  

const register = async (user, password) => {
  // Implement the registration logic
  return {
    user: user,
    message: "User registered successfully",
    
  };
};
 
app.use(session({
  secret: "superscerettesting",
  resave: false,
  saveUninitialized: true,
  cookie:{
     expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true,
  },
}));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.get("/demouser",async(req,res)=>{
  let fakeUser = new User({
    email: "student@gmail.com",
    username:"delta-student",
  });
  const regiterUser= await register(fakeUser,"helloworld");
  res.send(regiterUser);
});

const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");


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
app.use("/",userRoutes) ;

app.use((err, req, res, next) => {
  console.log(err)
  // res.render("error.ejs");
  res.send(err)
});



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});


 