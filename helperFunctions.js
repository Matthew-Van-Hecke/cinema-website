function stringArrayToDateArray(stringArray){
    return stringArray.map(s => stringToDate(s));
}

function stringToDate(dateString){
    return new Date(dateString);
}

function generateShowtimesCard({title, bannerUrl: imgUrl, showtimes}){
    let columnOne = generateWrapperElement("div", "col-md-6", `<img src="${imgUrl}" alt="${title}">`);
    let showtimesString = showtimes.map(showtime => `\n<li>${showtime}</li>`).join("");
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

{/* <div class="showtimes-card">
        <h4><%= movie.title %></h4>
        <div class="row">
            <div class="col-md-6">
                <img src="<%= movie.bannerUrl %>" alt="<%= movie.title %>">
            </div>
            <div class="col-md-6">
                <% movie.showtimes.forEach(showtime => { %>
                    <p><%= showtime %></p>
                <% }) %> 
            </div>
        </div>
    </div> */}


module.exports = {stringArrayToDateArray, generateShowtimesCard};