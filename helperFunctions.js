function stringArrayToDateArray(stringArray){
    return stringArray.map(s => stringToDate(s));
}

function stringToDate(dateString){
    return new Date(dateString);
}

module.exports = {stringArrayToDateArray, stringToDate};