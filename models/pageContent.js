const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema({
    pageName: String,
    title: String,
    content: String
});

module.exports = mongoose.model("PageContent", pageContentSchema);