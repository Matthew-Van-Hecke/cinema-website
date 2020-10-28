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

module.exports = {moveFile, getShowtimesArray, updateImage};