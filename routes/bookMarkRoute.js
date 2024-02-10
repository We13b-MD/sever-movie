const express = require("express");
const router = express.Router();

const Movies = require("../models/Movies");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").ObjectId;

const generateRandomKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
console.log(generateRandomKey());
//Post route to bookmark a movie for the user

router.post("/:userId", async (req, res) => {
  try {
    const Movieparam = req.params.movieId;
    const userParam = req.params.userId;
    console.log("Received MovieId:", Movieparam);
    console.log("Received userId:", userParam);
    const movie = await Movies.findOne({
      userId: userParam,
      movieId: Movieparam,
    });
    console.log(movie);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not  found for the user" });
    }

    movie.isBookmarked = !movie.isBookmarked;
    await movie.save();
    res.json({ success: true, message: "Bookmark updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// route to retrieve bookmarked movies

router.get("/:userId", async (req, res) => {
  try {
    const bookmarkedMovies = await Movies.find({
      userId: req.params.userId,
      isBookmarked: true,
    });
    res.json({ success: true, message: bookmarkedMovies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
