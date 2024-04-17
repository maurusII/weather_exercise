const apiKey = "8011cc0e8f3bb18806c881a1ae9b2093"; //metti qui la tua chiave
const citySelect = document.getElementById("city-select");
const weatherCards = document.getElementById("weather-cards"); //div to fill with weather cards
const form = document.getElementById("city-form"); //form to get the city

let cities = new Array();
citySelect.querySelectorAll('option').forEach((city) => {cities.push(city.value);});
const allCitiesSync = document.getElementById("all-cities-sync");
const allCities = document.getElementById("all-cities");

function clearWeatherCards() {
  weatherCards.innerHTML = '';
  //removes the weather cards from the div
}

function displayWeather(data){
  const city = data.name;
  const temp = data.main.temp;
  const descr = data.weather[0].description;
  const icon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
  return `<div class="card">
            <div class="card-body">
              <h5 class="card-title">${city}</h5>
              <img class="card-img-top" src=${icon} alt="Title">
              <p class="card-text">${temp}</p>
              <p class="card-text">${descr}</p>
            </div>
          </div>`;
}

function getWeather(selectedCity, apiKey) {
  clearWeatherCards()
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&lang=it&units=metric&appid=${apiKey}`;
  console.log(url);
  //completa la funzione
  fetch(url)
    .then(response => response.json())
    .then(data => {
      weatherCards.innerHTML = displayWeather(data);
    })
    .catch(error => console.error(error)); 
}

//oppure: 
// async function getWeather(selectedCity, apiKey) {
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&lang=it&units=metric&appid=${apiKey}`;
//   riempi se vuoi usare invece async await
//}

form.addEventListener("submit", event => {
  event.preventDefault(); // prevents form from refreshing page
  const selectedCity = document.getElementById("city-select").value;
  getWeather(selectedCity, apiKey);
});

allCitiesSync.addEventListener("click", event =>{
  event.preventDefault();
  clearWeatherCards();
  let promises = new Array();
  cities.forEach((city) => {
    promises.push(fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=it&units=metric&appid=${apiKey}`));
  });

  Promise.all(promises)
    .then(responses => {
      console.log(responses);
      Promise.all(responses.map((response) => response.json()))
        .then(data => {
          console.log(data);
          let cardsHTML = data.map((cityData) => displayWeather(cityData));
          cardsHTML.forEach((cardHTML) => {
            weatherCards.insertAdjacentHTML('beforeend', cardHTML);
          })
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
});

allCities.addEventListener("click", event => {
  event.preventDefault();
  clearWeatherCards();
  cities.forEach(city => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=it&units=metric&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        weatherCards.insertAdjacentHTML('beforeend', displayWeather(data));
      })
      .catch(error => console.error(error));
  })
})
