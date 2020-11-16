const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String
});

module.exports = mongoose.model("BlogPost", blogPostSchema);