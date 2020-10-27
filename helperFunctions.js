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

function sortShowtimesByDate(showtimesArray){
    const filteredShowtimes = filterOutPastShowtimes(showtimesArray);
    filteredShowtimes.sort((a, b) => a.valueOf() - b.valueOf());
    const sortedShowtimes = {};
    for(let showtime of filteredShowtimes){
        let date = showtime.toDateString();
        date = expandDateString(date);
        if(!sortedShowtimes[date]){
            sortedShowtimes[date] = [];
        }
        sortedShowtimes[date].push(convertToTimeString(showtime));
    }
    return sortedShowtimes;
}

function convertToTimeString(dateObject){
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let amOrPm = hours < 12 ? "AM" : "PM";
    return `${(hours % 12).toString()}:${minutes < 10 ? `0${minutes}` : minutes.toString()}${amOrPm}`;
}

function expandDateString(dateString){
    let [dayOfWeek, month, dayOfMonth, year] = dateString.split(" ");
    return `${getDayOfWeek(dayOfWeek)}, ${getMonth(month)} ${parseInt(dayOfMonth)}, ${year}`;
}

function filterOutPastShowtimes(showtimesArray){
    let now = new Date();
    return showtimesArray.filter(s => s >= now);
}

function getMonth(abbreviation){
    switch(abbreviation.toLowerCase()){
        case "01":
        case "jan":
            return "January";
        case "02":
        case "feb":
            return "February";
        case "03":
        case "mar":
            return "March";
        case "04":
        case "apr":
            return "April";
        case "05":
        case "may":
            return "May";
        case "06":
        case "jun":
            return "June";
        case "07":
        case "jul":
            return "July";
        case "08":
        case "aug":
            return "August";
        case "09":
        case "sep":
            return "September";
        case "10":
        case "oct":
            return "October";
        case "11":
        case "nov":
            return "November";
        case "12":
        case "dec":
            return "December";
        default:
            return "error";
    }
}

function getDayOfWeek(abbreviation){
    switch(abbreviation.toLowerCase()){
        case "sun":
            return "Sunday";
        case "mon":
            return "Monday";
        case "tue":
            return "Tuesday";
        case "wed":
            return "Wednesday";
        case "thu":
            return "Thursday";
        case "fri":
            return "Friday";
        case "sat":
            return "Saturday";
        default:
            return "error";
    }
}

module.exports = {stringArrayToDateArray, generateShowtimesCard, moveFile, getShowtimesArray, sortShowtimesByDate};