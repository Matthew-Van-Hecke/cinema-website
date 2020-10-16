// window.onbeforeunload = function() {
//     return "Are you sure you want to leave this page?";
// }

function addShowtime(){
    let showtimesDiv = document.getElementById("showtimes-div");
    let newShowtimeInput = createShowtimeInput(showtimesDiv.children.length);
    showtimesDiv.appendChild(newShowtimeInput);
}

function createShowtimeInput(index){
    let inputElement = document.createElement("input");
    inputElement.setAttribute("class", "form-control");
    inputElement.setAttribute("type", "datetime-local");
    inputElement.setAttribute("name", "showtime-" + index);
    return inputElement;
}