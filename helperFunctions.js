function stringArrayToDateArray(stringArray){
    return stringArray.map(s => stringToDate(s));
}

function stringToDate(dateString){
    return new Date(dateString);
}

function generateShowtimesCard({title, posterUrl: imgUrl, showtimes, id}){
    let columnOne = generateWrapperElement("div", "col-md-6", `<img src="${imgUrl}" alt="${title}">`);
    let showtimesString = showtimes.map(showtime => `\n<li>${new Date(showtime)}</li>`).join("");
    let showtimesUl = generateWrapperElement("ul", "showtimes-list", showtimesString);
    // let deleteForm = `\n<form action="/movies/${id}?_method=DELETE" method="post"><button>Delete Movie</button></form>`;
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

module.exports = {stringArrayToDateArray, generateShowtimesCard, moveFile, getShowtimesArray};