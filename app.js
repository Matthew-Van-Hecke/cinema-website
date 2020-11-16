const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(upload());
app.use(methodOverride('_method'));

mongoose.connect("mongodb://localhost/cinema-website", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("----Mongo Connection Open----")})
    .catch(err => {console.log("----Mongo Connection Error----\n", err)});

app.get('/', (req, res) => {
    Movie.find()
        .then(allMovies => { res.render("home", {allMovies}) })
        .catch(err => { console.log(err) });
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
        Movie.create({title: title, bannerUrl: bannerFindPath, posterUrl: posterFindPath, showtimes})
        .then(newMovie => console.log(newMovie))
        .catch(err => console.log(err));
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
    Movie.find()
        .then(allMovies => {
            let sortedShowtimes = {};
            for(let movie of allMovies){
                let showtimes = dateFunctions.stringArrayToDateArray(movie.showtimes);
                sortedShowtimes[movie.id] = dateFunctions.sortShowtimesByDate(showtimes);
            }
            res.render("showtimes", {allMovies, sortedShowtimes});
        })
        .catch(err => {
            console.log(err);
        });
});
// EDIT
app.get("/movies/:id/edit", (req, res) => {
    Movie.findById(req.params.id)
        .then(foundMovie => {
            res.render("edit", {foundMovie});
        })
        .catch(err => {
            console.log(err);
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
    Movie.findByIdAndUpdate(req.params.id, newData, {useFindAndModify: false})
        .then(() => {
            res.redirect(`/movies/${req.params.id}`);
        })
        .catch(err => {
            console.log(err);
        });
});
// DESTROY
app.delete("/movies/:id", (req, res) => {
    Movie.findById(req.params.id)
        .then(movie => {
            fs.unlink(`public/${movie.bannerUrl}`, () => {
                console.log("Removed banner image");
            });
            fs.unlink(`public/${movie.posterUrl}`, () => {
                console.log("Removed poster image");
                Movie.findByIdAndDelete(req.params.id, {useFindAndModify: false})
                    .then(() => {
                        res.redirect("/showtimes");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        })
        .catch(err => {
            console.log(err);
        });
});
app.get("/about", (req, res) => {
    PageContent.findOne({pageName: "about"})
        .then(content => {
            res.render("about", {content});
        })
        .catch(err => {
            console.log(err);
        });
});
// Edit Page Content
app.get("/:page/edit", (req, res) => {
    let pageName = req.params.page;
    PageContent.findOne({pageName})
        .then(content => {
            res.render("edit-page-content", {content});
        })
        .catch(err => {
            console.log(err);
        });
});
// Update Page Content
app.put("/:page", (req, res) => {
    const {_id, pageName, title, content} = req.body;
    const updatedData = {pageName, title, content};
    PageContent.findByIdAndUpdate(_id, updatedData, {useFindAndModify: false})
        .then(content => {
            res.redirect("/" + pageName);
        })
        .catch(err => {
            console.log(err);
        });
});
// Contact
app.get("/contact", (req, res) => {
    PageContent.findOne({pageName: "contact"})
        .then(pageContent => {
            res.render("contact", {pageContent});
        })
        .catch(err => {
            console.log(err);
        });
});
//LIST Blog
app.get("/blog", (req, res) => {
    BlogPost.find()
        .then(posts => {
            res.render("blog/list", {posts});
        })
        .catch(err => {
            console.log(err);
        });
});
//NEW Blogpost
app.get("/blog/new", (req, res) => {
    res.render("blog/new-post");
});
//Create Blogpost
app.post("/blog", (req, res) => {
    const {title, author, content} = req.body;
    BlogPost.create({title, author, content})
        .then(blogPost => {
            console.log(blogPost);
            res.redirect("/blog");
        })
        .catch(err => {
            console.log(err);
        })
});

// Not Found
// app.get("*", (req, res) => {
//     console.log("Page not found.");
//     res.render("not-found", {url: req.originalUrl});
//     // res.send(req.originalUrl);
// });

app.listen(3000, () => {
    console.log("---Server is running---");
});