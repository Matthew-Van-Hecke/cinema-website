const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');

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
            // let imgUrls = allMovies.map(m => `.${m.bannerUrl}`);
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
        banner.mv(bannerSavePath, (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("File Uploaded");
            }
        });
        Movie.create({title: title, bannerUrl: bannerFindPath}, (err, newMovie) => {
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
        res.render("movie-details");
    });
});

app.listen(3000, () => {
    console.log("---Server is running---");
})