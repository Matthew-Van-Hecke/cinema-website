const express = require('express');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const fs = require('fs');
const methodOverride = require('method-override');
const path = require('path');
const formProcessingFunctions = require('./helperFunctions/formProcessingFunctions');
const dateFunctions = require('./helperFunctions/dateFunctions');
const fileManagementFunctions = require('./helperFunctions/fileManagementFunctions');

const Movie = require('./models/movie');
const PageContent = require('./models/pageContent');
const BlogPost = require('./models/blogPost');

const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(upload());
app.use(methodOverride('_method'));

mongoose.connect("mongodb://localhost/cinema-website", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("----Mongo Connection Open----")})
    .catch(err => {console.log("----Mongo Connection Error----\n", err)});

app.get('/', async (req, res) => {
    const allMovies = await Movie.find();
    res.render("home", {allMovies});
});

//NEW
app.get('/movies/new', (req, res) => {
    res.render("movies/new");
});
//CREATE
app.post('/movies/new', async (req, res) => {
    console.log("IN THE POST ROUTE");
    console.log(req.files);
    if(req.files){
        const {title, runtime, director, starring, mpaa} = req.body;
        console.log(req.body);
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
        const newMovie = await Movie.create({title, bannerUrl: bannerFindPath, posterUrl: posterFindPath, runtime, director, starring, mpaa, showtimes})
        console.log(newMovie);
    }
    res.redirect('/');
});
//SHOW
app.get("/movies/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
    let sortedShowtimes = dateFunctions.sortShowtimesByDate(showtimes);
    res.render("movies/show", {movie, sortedShowtimes});
});
app.get("/movies", async (req, res) => {
    const allMovies = await Movie.find();
    let sortedShowtimes = {};
    for(let movie of allMovies){
        let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
        sortedShowtimes[movie.id] = dateFunctions.sortShowtimesByDate(showtimes);
    }
    res.render("movies/list", {allMovies, sortedShowtimes});
});
// EDIT
app.get("/movies/:id/edit", async (req, res) => {
    const foundMovie = await Movie.findById(req.params.id);
    res.render("movies/edit", {foundMovie});
});
// UPDATE
app.put("/movies/:id", async (req, res) => {
    const showtimes = formProcessingFunctions.getShowtimesArray(req.body);
    const {title, runtime, director, starring, mpaa} = req.body;
    const newData = {title, showtimes, runtime, director, starring, mpaa};
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
});
// DESTROY
app.delete("/movies/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    fs.unlink(`public/${movie.bannerUrl}`, () => {
        console.log("Removed banner image");
    });
    fs.unlink(`public/${movie.posterUrl}`, async () => {
        console.log("Removed poster image");
        await Movie.findByIdAndDelete(req.params.id, {useFindAndModify: false}).catch(() => {console.log("ERROR DELETING MOVIE")});
    });
    res.redirect("/movies");
});
app.get("/about", async (req, res) => {
    const content = await PageContent.findOne({pageName: "about"});
    res.render("about", {content});
});
// Edit Page Content
app.get("/:page/edit", async (req, res) => {
    let pageName = req.params.page;
    const content = await PageContent.findOne({pageName});
    res.render("edit-page-content", {content});
});
// Update Page Content
app.put("/:page", async (req, res) => {
    const {_id, pageName, title, content} = req.body;
    const updatedData = {pageName, title, content};
    await PageContent.findByIdAndUpdate(_id, updatedData, {useFindAndModify: false, runValidators: true});
    res.redirect("/" + pageName);
});
// Contact
app.get("/contact", async (req, res) => {
    const pageContent = await PageContent.findOne({pageName: "contact"});
    res.render("contact", {pageContent});
});
//LIST Blog
app.get("/blog", async (req, res) => {
    const posts = await BlogPost.find();
    res.render("blog/list", {posts});
});
//NEW Blogpost
app.get("/blog/new", (req, res) => {
    res.render("blog/new");
});
//Create Blogpost
app.post("/blog", async (req, res) => {
    const {title, author, content} = req.body;
    const blogPost = await BlogPost.create({title, author, content});
    console.log(blogPost);
    res.redirect("/blog");
});

// // Not Found
// app.get("*", (req, res) => {
//     console.log("Page not found.");
//     res.render("not-found", {url: req.originalUrl});
//     // res.send(req.originalUrl);
// });

app.listen(3000, () => {
    console.log("---Server is running---");
});