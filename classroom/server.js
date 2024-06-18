const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "superscerettesting",
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.get("/regiter",(req,res)=>{
    const name =req.query;
    res.send(name);
});

// app.get("/test", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`your count is ${req.session.count}`);
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
