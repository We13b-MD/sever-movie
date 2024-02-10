const express = require("express");
const router = express.Router();
const Movie = require("../models/Movies");
const moviesData = require("../data.json");
console.log(moviesData);

router.post("/addMovies", async (req, res) => {
  try {
    for (const movie of moviesData) {
      const newMovie = new Movie(movie);
      console.log(movie);
      await newMovie.save();
    }
    const insertedMovies = await Movie.insertMany(moviesData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error inserting movies", details: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch movies" });
  }
});

//router for search functionality
router.get("/search/", async (req, res) => {
  const searchQuery = req.query.q;

  try {
    const movies = await Movie.find({
      title: { $regex: searchQuery, $options: "i" },
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Unable to perform Search" });
  }
});
module.exports = router;
