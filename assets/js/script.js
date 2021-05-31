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
    let priorCity = localStorage.getItem("last location");
    console.log(priorCity);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=standard`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
      let { main, name, sys, wind, weather } = data;
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;
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
      <p>UV:</p>
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

function UVIndex(ln,lt){
  //lets build the url for uvindex.
  var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey+"&lat="+lt+"&lon="+ln;
  $.ajax({
          url:uvqURL,
          method:"GET"
          }).then(function(response){
              $(currentUvIndex).html(response.value);
          });
}
/*
function forecast(cityid){
  var dayover= false;
  var queryforecastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+apiKey;
  $.ajax({
      url:queryforecastURL,
      method:"GET"
  }).then(function(response){
      
      for (i=0;i<5;i++){
          var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
          var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
          var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
          var tempK= response.list[((i+1)*8)-1].main.temp;
          var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
          var humidity= response.list[((i+1)*8)-1].main.humidity;
      
          $("#fDate"+i).html(date);
          $("#fIcon"+i).html("<img src="+iconurl+">");
          $("#fTemp"+i).html(tempF+"&#8457");
          $("#fHumidity"+i).html(humidity+"%");
      }
      
  });
}
*/