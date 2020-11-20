const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    bannerUrl: String,
    posterUrl: String,
    runtime: {
        type: Number,
        default: 110
    },
    director: {
        type: String,
        default: "Alfred Hitchcock"
    },
    starring: {
        type: String,
        default: "Cary Grant, Grace Kelly"
    },
    mpaa: {
        type: String,
        default: "NR"
    },
    showtimes: [
        String
    ],
    synopsis: {
        type: String,
        default: "A retired jewel thief sets out to prove his innocence after being suspected of returning to his former occupation."
    }
});

module.exports = mongoose.model("Movie", movieSchema);