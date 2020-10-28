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
    let hoursConverted = hours % 12 === 0 ? 12 : hours % 12;
    return `${hoursConverted.toString()}:${minutes < 10 ? `0${minutes}` : minutes.toString()}${amOrPm}`;
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

module.exports = sortShowtimesByDate;