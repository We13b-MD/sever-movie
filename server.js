require("dotenv").config();
const express = require("express");
const connectDB = require("./Connectdb");
const session = require("express-session");
const Config = require("./Config");
const passport = require("passport");
const cloudinary = require('cloudinary').v2
const cors = require("cors");
const app = express();
const herokuroute = require('./routes/index.js')
const User = require("./users");
const GoogleUsers = require("./Googleusers");
const path = require("path");
const PORT = process.env.PORT || 5000;
const localStrategy = require("passport-local").Strategy;
const authroutes = require("./route/auth");
const mongoose = require("mongoose");
const accountController = require("./accountController");
const bodyParser = require("body-parser");
const Movie = require("./models/Movies.js");
require('dotenv').config
const movieRoutes = require("./routes/movieRoutes.js");
const bookmarkRoutes = require('./routes/bookMarkRoute.js')
app.use(
  express.static(path.join(__dirname, "mikiflix"), {
    maxAge: "31536000", // Set the max-age to one year (in seconds)
    immutable: true,
  })
);

app.use(express.json());
app.use("/movieuploads", express.static("movieuploads"));
const SecretKey = "michael007";
app.use(express.urlencoded({ extended: true }));
const sessionMiddleware = session({
  secret: SecretKey,
  resave: false,
  saveUninitialized: false,
});



app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5000",
  "https://accounts.google.com",
  "http://localhost:3000",
  "https://Mikeflix.onrender.com",
  "https://mike-flix-api.onrender.com/",
  "https://movie-server-e3b57795d19a.herokuapp.com/",
  "https://res.cloudinary.com" 
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: "Content-type, Authorization", // allow this headers
  credentials: true,
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors(corsOptions));
connectDB();

// Use Helmet middleware to set security-related headers

// Your other Express configurations and routes...

// Start the server

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
app.use(passport.initialize());

// You can set COOP headers to allow your  site to be opened in the same browsing context as the initiating site:
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  next();
});

app.use("/auth", authroutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookmarks", bookmarkRoutes)


// routes for local strategy
app.get("/", (req, res) => {
  res.send("Introduction to JWT");
});

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:http://localhost:5000/movieuploads;");
  next();
});


app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  accountController.profile
);
app.post("/login", passport.authenticate("local"), accountController.login);
app.post("/register", accountController.register);

passport.serializeUser((user, done) => {
  // Serialize user data to store in the session (e.g., user.id)
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Retrieve user data from the session (using the user ID)
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//routes for google strategy
// Example route to handle Google user data
app.post("/auth/google/callback", (req, res) => {
  // Extract user data from the request body sent by the frontend
  const { googleId, email, name } = req.body;

  // Now, you can save this user data to your MongoDB database using Mongoose or any other ORM/ODM
  // Perform the necessary MongoDB operations to save the user data
  // Example using Mongoose:
  const newUser = new GoogleUsers({
    googleId,
    email,
    name,
    // Other user properties if needed
  });

  newUser
    .save()
    .then((savedUser) => {
      // Handle successful user data insertion
      res.status(200).json({
        message: "Google user data saved successfully",
        user: savedUser,
      });
    })
    .catch((error) => {
      // Handle error while saving user data
      res
        .status(500)
        .json({ error: "Failed to save Google user data", details: error });
    });
});



app.get("/api/movies/:slug", async (req, res) => {
  try {
    const movies = await Movie.find({})
      .select("title thumbnail slug description stars category")
      .exec();

    const slugParam = req.params.slug;
    const data = await Movie.findOne({ slug: slugParam });
  
    res.json(data);
    if (!data) {
      throw new Error("Error occured while getting movie");
    }
  } catch (err) {
    res.status(500).json({ err: "Error occured while fetching movie" });
  }
});

app.delete("/api/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    await Movie.deleteOne({ id: movieId });
    res.json("Deleted");
  } catch (err) {
    console.log(err);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on  port ${PORT}`);
});



// Configure Cloudinary with your cloud_name
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace 'your_cloud_name' with your actual cloud name
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

app.get('/', (req,res) => {
    res.json({message: "Here is the server response"})
})

//image  upload Api

app.post("/image-upload", (req,res) =>{
    //collected image from a user
    const data = {
        image:req.body.image,
    }

    //uplaod image here
    cloudinary.uploader.upload(data.image)
    .then((result) =>{
        res.status(200).send({
            message:"success",
            result,
        })
    }).catch((err)=>{
        res.status(500).send({
            message:"failure",
            err,
        })
    })
})

module.exports = app;



