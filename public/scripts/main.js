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
    // inputElement.classList.add("form-control");
    inputElement.setAttribute("type", "datetime-local");
    inputElement.setAttribute("name", "showtime-" + index);
    let removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.setAttribute("onclick", `removeShowtime(${index})`);
    removeButton.innerText = "X";
    let div = document.createElement("div");
    div.classList.add("showtime", "form-control");
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
    // parentDiv.children.forEach((containingDiv, i) => {
    //     let label = "showtime-" + i;
    //     let inputEl = containingDiv.children[1];
    //     inputEl.setAttribute("name", label);
    //     containingDiv.setAttribute("id", label);
    // });
}