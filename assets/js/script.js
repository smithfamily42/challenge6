// API key
let apiKey="b230f03f2f026de4e3cf2def7c3a58f4";
// variables
let form = document.querySelector(".pure-form");
let input = document.querySelector("#search-city");
let msg = document.querySelector(".message");
let list = document.querySelector(".button-grp");
let main = document.querySelector("#city-info");

//event listner
form.addEventListener("submit", event => {
    event.preventDefault();
    let inputVal = input.value;

    //evaluate if there is already a city
    let listItems = list.querySelectorAll(".button-grp");
    let listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        let filteredArray = listItemsArray.filter(el => {
            let content = "";
            
            if (inputVal.includes(",")) {
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                    .querySelector("#cityName")
                    .textContent.toLocaleLowerCase();
                } else {
                    content = el.querySelector("#cityName").dataset.name.toLocaleLowerCase();
                }
            } else {
                content = el.querySelector("#cityName").textContent.toLowerCase();
            }
            return content ===inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `This city ${
              filteredArray[0].querySelector("#cityName").textContent
            } is already in your search history`;
            form.reset();
            input.focus();
            return;
        }
       
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=standard`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
      let { main, name, sys, wind, weather } = data;
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;
console.log(data);
      let div = document.createElement("div");
      div.classList.add("mainContent");
      let markup = `
      <h3 data-name="${name},${sys.country}"><span>${name}</span></h3>
      <figure>
      <img src="${icon}" alt="${
    weather[0]["description"]
  }">
      <figcaption>${weather[0]["description"]}</figcaption>
    </figure>
      <p>Temp: ${Math.round((((main.temp) - 273.5) * 1.8) + 32)}<sup>°F</sup></p>
      <p>Humidity: ${main.humidity} %</p>
      <p>Wind: ${((wind.speed) * 2.237).toFixed(1)} MPH</p>
    `;
      div.innerHTML = markup;
      document.getElementById("city-info").appendChild(div);

    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

