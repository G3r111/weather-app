const cityInput =
  document.getElementById("cityInput");

const searchButton =
  document.getElementById("searchButton");

const weatherResult =
  document.getElementById("weatherResult");


// Weather code -> description and icon
function getWeatherInfo(code) {

  if (code === 0) {
    return {
      description: "Clear sky",
      icon: "☀️"
    };
  }

  if (code === 1 || code === 2) {
    return {
      description: "Partly cloudy",
      icon: "🌤️"
    };
  }

  if (code === 3) {
    return {
      description: "Cloudy",
      icon: "☁️"
    };
  }

  if (code === 45 || code === 48) {
    return {
      description: "Foggy",
      icon: "🌫️"
    };
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55
  ) {
    return {
      description: "Drizzle",
      icon: "🌦️"
    };
  }

  if (
    code === 61 ||
    code === 63 ||
    code === 65
  ) {
    return {
      description: "Rain",
      icon: "🌧️"
    };
  }

  if (
    code === 71 ||
    code === 73 ||
    code === 75
  ) {
    return {
      description: "Snow",
      icon: "❄️"
    };
  }

  if (
    code === 80 ||
    code === 81 ||
    code === 82
  ) {
    return {
      description: "Rain showers",
      icon: "🌧️"
    };
  }

  if (
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return {
      description: "Thunderstorm",
      icon: "⛈️"
    };
  }

  return {
    description: "Unknown weather",
    icon: "🌤️"
  };
}


// Search function
async function searchWeather() {

  const city =
    cityInput.value.trim();


  // Check empty input
  if (city === "") {

    weatherResult.innerHTML = `
      <div class="error-message">

        <h3>Please enter a city</h3>

        <p>
          Example: Tirana, London or Rome.
        </p>

      </div>
    `;

    return;
  }


  // Show loading
  weatherResult.innerHTML = `
    <div class="loading">
      Getting weather for ${city}...
    </div>
  `;


  try {

    // Request our Node.js backend
    const response =
      await fetch(
        `/api/weather?city=${encodeURIComponent(city)}`
      );


    const data =
      await response.json();


    // Handle backend errors
    if (!response.ok) {

      weatherResult.innerHTML = `
        <div class="error-message">

          <h3>Unable to find weather</h3>

          <p>
            ${data.error}
          </p>

        </div>
      `;

      return;
    }


    const weatherInfo =
      getWeatherInfo(
        data.weatherCode
      );


    // Display weather
    weatherResult.innerHTML = `

      <div class="weather-card">

        <div class="weather-main">

          <div>

            <p class="app-label">
              Current Weather
            </p>

            <h2 class="location">
              ${data.city}, ${data.country}
            </h2>

            <p class="weather-description">
              ${weatherInfo.description}
            </p>

          </div>


          <div class="temperature-area">

            <div class="weather-icon">
              ${weatherInfo.icon}
            </div>

            <div class="temperature">
              ${Math.round(data.temperature)}°
            </div>

          </div>

        </div>


        <div class="weather-details">

          <div class="detail-card">

            <div class="detail-icon">
              🌡️
            </div>

            <p class="detail-label">
              Feels Like
            </p>

            <p class="detail-value">
              ${Math.round(data.feelsLike)} °C
            </p>

          </div>


          <div class="detail-card">

            <div class="detail-icon">
              💧
            </div>

            <p class="detail-label">
              Humidity
            </p>

            <p class="detail-value">
              ${data.humidity}%
            </p>

          </div>


          <div class="detail-card">

            <div class="detail-icon">
              💨
            </div>

            <p class="detail-label">
              Wind Speed
            </p>

            <p class="detail-value">
              ${data.windSpeed} km/h
            </p>

          </div>

        </div>

      </div>

    `;


  } catch (error) {

    console.error(error);

    weatherResult.innerHTML = `

      <div class="error-message">

        <h3>Something went wrong</h3>

        <p>
          Please try again later.
        </p>

      </div>

    `;

  }

}


// Search button
searchButton.addEventListener(
  "click",
  searchWeather
);


// Search when pressing Enter
cityInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {
      searchWeather();
    }

  }
);