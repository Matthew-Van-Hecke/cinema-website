const express = require('express');
const router = express.Router();

const BlogPost = require('../models/blogPost');
const asyncCatch = require('../utils/asyncCatch');

//LIST
router.get("/", asyncCatch(async (req, res) => {
    const posts = await BlogPost.find();
    res.render("blog/list", {posts});
}));
//NEW
router.get("/new", (req, res) => {
    res.render("blog/new");
});
//CREATE
router.post("/", asyncCatch(async (req, res) => {
    const {title, author, content} = req.body;
    const blogPost = await BlogPost.create({title, author, content});
    res.redirect("/blog");
}));

module.exports = router;