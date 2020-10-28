function stringArrayToDateArray(stringArray){
    return stringArray.map(s => stringToDate(s));
}

function stringToDate(dateString){
    return new Date(dateString);
}

function generateShowtimesCard({title, posterUrl: imgUrl, id}, showtimes){
    console.log("Generate Showtime Card", showtimes);
    let columnOne = generateWrapperElement("div", "col-md-6", `<img src="${imgUrl}" alt="${title}">`);
    let showtimesString = generateShowtimesInnerHTML(showtimes);
    let showtimesUl = generateWrapperElement("ul", "showtimes-list", showtimesString);
    let columnTwo = generateWrapperElement("div", "col-md-6", showtimesUl);
    let titleElement = generateWrapperElement("h4", "movie-showtime-title", title);
    let row = generateWrapperElement("div", "row", `${columnOne}\n${columnTwo}`);
    let showtimeCard = generateWrapperElement("div", "showtimes-card", `${titleElement}\n${row}`);
    return showtimeCard;
}

function generateShowtimesInnerHTML(showtimes){
    const showdates = Object.keys(showtimes);
    let showtimesStringBuilder = [];
    for(let showdate of showdates){
        const timesArray = [];
        for(let time of showtimes[showdate]){
            let timeElement = generateWrapperElement("li", "showtime-time", time);
            timesArray.push(timeElement);
        }
        const timesUl = generateWrapperElement("ul", "showtime-times-ul", timesArray.join("\n"));
        const dateElement = generateWrapperElement("li", "showtime-date-times", `${showdate}\n${timesUl}`);
        showtimesStringBuilder.push(dateElement);
    }
    return generateWrapperElement("ul", "showtimes", showtimesStringBuilder.join("\n"));
}

function generateWrapperElement(type, className, innerHTML){
    return `<${type} class="${className}">\n${innerHTML}\n</${type}>`;
}

function moveFile(object, savePath){
    object.mv(savePath, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("File Uploaded");
        }
    });
}

function getShowtimesArray(formData){
    const showtimes = [];
    for(let i = 0; true; i++){
        let showtime = formData["showtime-" + i];
        if(showtime){
            console.log(showtime);
            showtimes.push(showtime);
        } else {
            break;
        }
    }
    return showtimes;
}



function updateImage(object, currentImageUrl, imageRole, fs){
    console.log(currentImageUrl);
    fs.unlink(currentImageUrl, () => {
        console.log("Removed poster image");
        let savePath = `./public/media/${imageRole}s/${object.name}`;
        moveFile(object, savePath);
    });
}

module.exports = {stringArrayToDateArray, generateShowtimesCard, moveFile, getShowtimesArray, updateImage};