const express = require('express');
const { urlencoded } = require('body-parser');
const upload = require('express-fileupload');

const app = express();


app.set("view engine", "ejs");
app.use(urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(upload());

app.get('/', (req, res) => {
    const imgUrls = ["https://www.towne-cinema.com/wp-content/uploads/2020/08/tenetbanner.jpg", 
        "https://www.towne-cinema.com/wp-content/uploads/2020/10/cocowebban.jpg", 
        "https://www.towne-cinema.com/wp-content/uploads/2020/10/ththingwebban.jpg"];
    res.render("home", {imgUrls});
});

//NEW
app.get('/new', (req, res) => {
    res.render("new");
});
//CREATE
app.post('/new', (req, res) => {
    if(req.files){
        let banner = req.files.banner;
        banner.mv('./public/media/banners/' + banner.name, (err) => {
            if(err){
                console.log(err);
            } else {
                console.log("File Uploaded");
            }
        });
    }
    res.redirect('/');
});

app.listen(3000, () => {
    console.log("---Server is running---");
})