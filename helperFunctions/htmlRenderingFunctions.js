function generateShowtimesCard({title, posterUrl: imgUrl}, showtimes){
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

module.exports = {generateShowtimesCard};