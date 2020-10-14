const express = require('express');

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    const imgUrls = ["https://www.towne-cinema.com/wp-content/uploads/2020/08/tenetbanner.jpg", 
        "https://www.towne-cinema.com/wp-content/uploads/2020/10/cocowebban.jpg", 
        "https://www.towne-cinema.com/wp-content/uploads/2020/10/ththingwebban.jpg"];
    res.render("home", {imgUrls});
});

app.listen(3000, () => {
    console.log("---Server is running---");
})