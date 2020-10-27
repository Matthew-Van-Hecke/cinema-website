const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const fs = require("fs");
const methodOverride = require('method-override');
const {stringArrayToDateArray, generateShowtimesCard, moveFile, getShowtimesArray, sortShowtimesByDate} = require('./helperFunctions');

const Movie = require('./models/movie');

const app = express();

app.set("view engine", "ejs");
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(upload());
app.use(methodOverride('_method'));

mongoose.connect("mongodb://localhost/cinema-website", {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', (req, res) => {
    Movie.find({}, (err, allMovies) => {
        if(err){
            console.log(err);
        } else {
            console.log(allMovies);
            res.render("home", {allMovies});
        }
    });
});

//NEW
app.get('/new', (req, res) => {
    res.render("new");
});
//CREATE
app.post('/new', (req, res) => {
    if(req.files){
        let title = req.body.title;
        let banner = req.files.banner;
        let poster = req.files.poster;
        let bannerFindPath = '/media/banners/' + banner.name;
        let bannerSavePath = './public' + bannerFindPath;
        let posterFindPath = '/media/posters/' + poster.name;
        let posterSavePath = './public' + posterFindPath;
        let showtimes = getShowtimesArray(req.body);
        console.log(showtimes);
        moveFile(banner, bannerSavePath);
        moveFile(poster, posterSavePath);
        Movie.create({title: title, bannerUrl: bannerFindPath, posterUrl: posterFindPath, showtimes}, (err, newMovie) => {
            if(err){
                console.log(err);
            } else {
                console.log(newMovie);
            }
        });
    }
    res.redirect('/');
});
//SHOW
app.get("/movies/:id", (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) => {
        if(err){
            console.log(err);
        } else {
            let showtimes = stringArrayToDateArray(foundMovie.showtimes);
            let sortedShowtimes = sortShowtimesByDate(showtimes);
            foundMovie.showtimes = sortedShowtimes;
            console.log(foundMovie.showtimes);
            res.render("movie-details", {foundMovie, sortedShowtimes});
        }
    });
});
app.get("/showtimes", (req, res) => {
    Movie.find({}, (err, allMovies) => {
        if(err){
            console.log(err);
        } else {
            console.log(typeof allMovies[0].showtimes[0]);
            let sortedShowtimes = {};
            for(let movie of allMovies){
                let showtimes = stringArrayToDateArray(movie.showtimes);
                sortedShowtimes[movie.id] = sortShowtimesByDate(showtimes);
            }
            res.render("showtimes", {allMovies, generateShowtimesCard, sortedShowtimes});
        }
    });
});
// EDIT
app.get("/movies/:id/edit", (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundMovie);
            // foundMovie.showtimes = stringArrayToDateArray(foundMovie.showtimes);
            res.render("edit", {foundMovie});
        }
    });
});
// UPDATE
app.put("/movies/:id", (req, res) => {
    const showtimes = getShowtimesArray(req.body);
    const newData = {title: req.body.title, showtimes};
    Movie.findByIdAndUpdate(req.params.id, newData, {useFindAndModify: false}, (err, movie) => {
        if(err){
            console.log(err);
        } else {
            res.redirect(`/movies/${req.body.id}`);
        }
    });
});
// DESTROY
app.delete("/movies/:id", (req, res) => {
    Movie.findById(req.params.id, (err, movie) => {
        if(err){
            console.log(err);
        } else {
            fs.unlink(`public/${movie.bannerUrl}`, () => {
                console.log("Removed banner image");
            });
            fs.unlink(`public/${movie.posterUrl}`, () => {
                console.log("Removed poster image");
                Movie.findByIdAndDelete(req.params.id, {useFindAndModify: false}, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        res.redirect("/showtimes");
                    }
                });
            });
        }
    });
});
app.get("/about", (req, res) => {
    res.render("about");
});
// Edit Page Content
app.get("/:page/edit", (req, res) => {
    let pageName = req.params.page;
    res.render("edit-page-content", {pageName});
});

app.listen(3000, () => {
    console.log("---Server is running---");
})