const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    bannerUrl: String,
    showtimes: [
        String
    ]
});

module.exports = mongoose.model("Movie", movieSchema);