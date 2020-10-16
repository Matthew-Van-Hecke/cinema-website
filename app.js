const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const {stringArrayToDateArray, stringToDate} = require('./helperFunctions');

const Movie = require('./models/movie');

const app = express();

app.set("view engine", "ejs");
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(upload());

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
        let bannerFindPath = '/media/banners/' + banner.name;
        let bannerSavePath = './public' + bannerFindPath;
        let showtimes = [];
        for(let i = 0; true; i++){
            let showtime = req.body["showtime-" + i];
            if(showtime){
                showtimes.push(showtime);
            } else {
                break;
            }
        }
        console.log(showtimes);
        banner.mv(bannerSavePath, (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("File Uploaded");
            }
        });
        Movie.create({title: title, bannerUrl: bannerFindPath, showtimes}, (err, newMovie) => {
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
app.get("/movie-details/:id", (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) => {
        console.log(foundMovie);
        foundMovie.showtimes = stringArrayToDateArray(foundMovie.showtimes);
        res.render("movie-details", {foundMovie});
    });
});

app.listen(3000, () => {
    console.log("---Server is running---");
})