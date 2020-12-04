const express = require('express');
const upload = require('express-fileupload');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const fs = require('fs');
const methodOverride = require('method-override');
const path = require('path');
const ExpressError = require('./utils/expressError');
const { movieSchema } = require('./schemas');
const asyncCatch = require('./utils/asyncCatch');

const Movie = require('./models/movie');
const PageContent = require('./models/pageContent');

const movieRoutes = require('./routes/movieRoutes');
const blogRoutes = require('./routes/blogRoutes');

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

app.use('/movies', movieRoutes);
app.use('/blog', blogRoutes);

app.get("/about", asyncCatch(async (req, res) => {
    const content = await PageContent.findOne({pageName: "about"});
    res.render("about", {content});
}));
// Edit Page Content
app.get("/:page/edit", asyncCatch(async (req, res) => {
    let pageName = req.params.page;
    const content = await PageContent.findOne({pageName});
    res.render("edit-page-content", {content});
}));
// Update Page Content
app.put("/:page", asyncCatch(async (req, res) => {
    const {_id, pageName, title, content} = req.body;
    const updatedData = {pageName, title, content};
    await PageContent.findByIdAndUpdate(_id, updatedData, {useFindAndModify: false, runValidators: true});
    res.redirect("/" + pageName);
}));
// Contact
app.get("/contact", asyncCatch(async (req, res) => {
    const pageContent = await PageContent.findOne({pageName: "contact"});
    res.render("contact", {pageContent});
}));

app.all("*", (req, res) => {
    throw new ExpressError(`Error! ${req.path} not found`, 404);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("---Server is running---");
});