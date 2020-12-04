const express = require('express');
const fs = require('fs');
const router = express.Router();

const Movie = require('../models/movie');

const { dateFunctions, fileManagementFunctions, formProcessingFunctions } = require('../utils');
const asyncCatch = require('../utils/asyncCatch');

//NEW
router.get('/new', (req, res) => {
    res.render("movies/new");
});
//CREATE
router.post('/new', asyncCatch(async (req, res, next) => {
    console.log("IN THE POST ROUTE");
    console.log(req.files);
    if(req.files){
        const {title, runtime, director, starring, mpaa, synopsis} = req.body;
        const {banner, poster} = req.files;
        let bannerFindPath = '/media/banners/' + banner.name;
        let bannerSavePath = './public' + bannerFindPath;
        let posterFindPath = '/media/posters/' + poster.name;
        let posterSavePath = './public' + posterFindPath;
        let showtimes = formProcessingFunctions.getShowtimesArray(req.body);
        fileManagementFunctions.moveFile(banner, bannerSavePath);
        fileManagementFunctions.moveFile(poster, posterSavePath);
        const newMovie = await Movie.create({title, bannerUrl: bannerFindPath, posterUrl: posterFindPath, runtime, director, starring, mpaa, synopsis, showtimes});
        res.redirect(`/movies/${newMovie._id}`);
    } else {
        next(new ExpressError("Please select images to upload for this movie"));
    }
}));
//SHOW
router.get("/:id", asyncCatch(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
    let sortedShowtimes = dateFunctions.sortShowtimesByDate(showtimes);
    res.render("movies/show", {movie, sortedShowtimes});
}));
router.get("/", asyncCatch(async (req, res) => {
    const allMovies = await Movie.find();
    let sortedShowtimes = {};
    for(let movie of allMovies){
        let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
        sortedShowtimes[movie.id] = dateFunctions.sortShowtimesByDate(showtimes);
    }
    res.render("movies/list", {allMovies, sortedShowtimes});
}));
// EDIT
router.get("/:id/edit", asyncCatch(async (req, res) => {
    const foundMovie = await Movie.findById(req.params.id);
    res.render("movies/edit", {foundMovie});
}));
// UPDATE
router.put("/:id", asyncCatch(async (req, res) => {
    const showtimes = formProcessingFunctions.getShowtimesArray(req.body);
    const {title, runtime, director, starring, mpaa, synopsis} = req.body;
    const newData = {title, showtimes, runtime, director, starring, mpaa, synopsis};
    if(req.files && req.files.poster){
        const poster = req.files.poster;
        console.log("POSTER");
        let posterFindPath = '/media/posters/' + poster.name;
        console.log(posterFindPath);
        fileManagementFunctions.updateImage(poster, `public${req.body.posterUrl}`, "poster", fs);
        newData.posterUrl = posterFindPath;
    }
    if(req.files && req.files.banner){
        const banner = req.files.banner;
        console.log("BANNER");
        let bannerFindPath = '/media/banners/' + banner.name;
        console.log(bannerFindPath);
        fileManagementFunctions.updateImage(banner, `public${req.body.bannerUrl}`, "banner", fs);
        newData.bannerUrl = bannerFindPath;
    }
    await Movie.findByIdAndUpdate(req.params.id, newData, {useFindAndModify: false, runValidators: true});
    res.redirect(`/movies/${req.params.id}`);
}));
// DESTROY
router.delete("/:id", asyncCatch(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    fs.unlink(`public/${movie.bannerUrl}`, () => {
        console.log("Removed banner image");
    });
    fs.unlink(`public/${movie.posterUrl}`, async () => {
        console.log("Removed poster image");
        await Movie.findByIdAndDelete(req.params.id, {useFindAndModify: false}).catch(() => {console.log("ERROR DELETING MOVIE")});
    });
    res.redirect("/movies");
}));

module.exports = router;