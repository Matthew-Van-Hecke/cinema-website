function stringArrayToDateArray(stringArray){
    return stringArray.map(s => stringToDate(s));
}

function stringToDate(dateString){
    return new Date(dateString);
}

function generateShowtimesCard({title, posterUrl: imgUrl, showtimes}){
    let columnOne = generateWrapperElement("div", "col-md-6", `<img src="${imgUrl}" alt="${title}">`);
    let showtimesString = showtimes.map(showtime => `\n<li>${new Date(showtime)}</li>`).join("");
    let showtimesUl = generateWrapperElement("ul", "showtimes-list", showtimesString);
    let columnTwo = generateWrapperElement("div", "col-md-6", showtimesUl);
    let titleElement = generateWrapperElement("h4", "movie-showtime-title", title);
    let row = generateWrapperElement("div", "row", `${columnOne}\n${columnTwo}`);
    let showtimeCard = generateWrapperElement("div", "showtimes-card", `${titleElement}\n${row}`);
    return showtimeCard;
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


module.exports = {stringArrayToDateArray, generateShowtimesCard, moveFile};