const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String
});

module.exports = mongoose.model("BlogPost", blogPostSchema);