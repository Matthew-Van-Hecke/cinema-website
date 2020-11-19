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
    inputElement.setAttribute("type", "datetime-local");
    inputElement.setAttribute("name", "showtime-" + index);
    inputElement.classList.add("form-control");
    let removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.setAttribute("onclick", `removeShowtime(${index})`);
    removeButton.classList.add("input-group-text");
    removeButton.innerText = "X";
    let div = document.createElement("div");
    div.classList.add("showtime", "input-group", "mb-3");
    div.setAttribute("id", "showtime-" + index);
    div.appendChild(removeButton);
    div.appendChild(inputElement);
    return div;
}

function removeShowtime(id){
    let elementToRemove = document.getElementById("showtime-" + id);
    let parentDiv = document.getElementById("showtimes-div");
    parentDiv.removeChild(elementToRemove);
    for (let i = 0; i < parentDiv.childElementCount; i++){
        let label = "showtime-" + i;
        let elToUpdate = parentDiv.children[i];
        elToUpdate.setAttribute("id", label);
        elToUpdate.children[0].setAttribute("onclick", `removeShowtime(${i})`);
        elToUpdate.children[1].setAttribute("name", label);
    }
}
let movieLookup = document.getElementById("movie-lookup-form");
// .addEventListener("submit", function(e){
//     e.preventDefault();
//     console.log("Submitting");
// });

function searchForMovie(){
    let searchBox = document.getElementById("search-title");
    let searchTerm = searchBox.value;
    console.log("Searching for: " + searchTerm);
}