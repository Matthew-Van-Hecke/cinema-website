const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const fs = require('fs');
const methodOverride = require('method-override');
const formProcessingFunctions = require('./helperFunctions/formProcessingFunctions');
const dateFunctions = require('./helperFunctions/dateFunctions');
const htmlRenderingFunctions = require('./helperFunctions/htmlRenderingFunctions');
const fileManagementFunctions = require('./helperFunctions/fileManagementFunctions');

const Movie = require('./models/movie');
const PageContent = require('./models/pageContent');

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
        let showtimes = formProcessingFunctions.getShowtimesArray(req.body);
        console.log(showtimes);
        fileManagementFunctions.moveFile(banner, bannerSavePath);
        fileManagementFunctions.moveFile(poster, posterSavePath);
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
            let showtimes = dateFunctions.stringArrayToDateArray(foundMovie.showtimes);
            let sortedShowtimes = dateFunctions.sortShowtimesByDate(showtimes);
            foundMovie.showtimes = sortedShowtimes;
            console.log(foundMovie.showtimes);
            res.render("movie-details", {foundMovie, sortedShowtimes});
        }
    });
});
app.get("/showtimes", (req, res) => {
    const {generateShowtimesCard} = htmlRenderingFunctions;
    Movie.find({}, (err, allMovies) => {
        if(err){
            console.log(err);
        } else {
            console.log(typeof allMovies[0].showtimes[0]);
            let sortedShowtimes = {};
            for(let movie of allMovies){
                let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
                sortedShowtimes[movie.id] = dateFunctions.sortShowtimesByDate(showtimes);
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
            // foundMovie.showtimes = dateFunctions.stringArrayToDateArray(foundMovie.showtimes);
            res.render("edit", {foundMovie});
        }
    });
});
// UPDATE
app.put("/movies/:id", (req, res) => {
    const showtimes = formProcessingFunctions.getShowtimesArray(req.body);
    const newData = {title: req.body.title, showtimes};
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
    Movie.findByIdAndUpdate(req.params.id, newData, {useFindAndModify: false}, (err, movie) => {
        if(err){
            console.log(err);
        } else {
            console.log(req.params.id);
            res.redirect(`/movies/${req.params.id}`);
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
    PageContent.findOne({pageName: "about"}, (err, content) => {
        if(err){
            console.log(err);
        } else {
            res.render("about", {content});
        }
    });
});
// Edit Page Content
app.get("/:page/edit", (req, res) => {
    let pageName = req.params.page;
    PageContent.findOne({pageName}, (err, content) => {
        if(err){
            console.log(err);
        } else {
            res.render("edit-page-content", {content});
        }
    });
});
// Update Page Content
app.put("/:page", (req, res) => {
    const {_id, pageName, title, content} = req.body;
    const updatedData = {pageName, title, content};
    PageContent.findByIdAndUpdate(_id, updatedData, {useFindAndModify: false}, (err, content) => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/" + pageName);
        }
    });
});
// Contact
app.get("/contact", (req, res) => {
    PageContent.findOne({pageName: "contact"}, (err, pageContent) => {
        if(err){
            console.log(err);
        } else {
            res.render("contact", {pageContent});
        }
    });
});

// Not Found
app.get("*", (req, res) => {
    res.render("not-found", {url: req.originalUrl});
    // res.send(req.originalUrl);
});

app.listen(3000, () => {
    console.log("---Server is running---");
});