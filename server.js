const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;


// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));


// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Weather API route
app.get("/api/weather", async (req, res) => {

  // Get city from query parameter
  const city = req.query.city;

  // Check if city was provided
  if (!city) {
    return res.status(400).json({
      error: "City is required"
    });
  }

  try {

    // STEP 1: Find the city coordinates
    const cityResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          language: "en",
          format: "json"
        }
      }
    );


    // Check if city exists
    if (!cityResponse.data.results) {
      return res.status(404).json({
        error: "City not found"
      });
    }


    // Get the first city result
    const location = cityResponse.data.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;


    // STEP 2: Get current weather using coordinates
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
          timezone: "auto"
        }
      }
    );


    // Current weather data
    const weather = weatherResponse.data.current;


    // STEP 3: Send weather data to the frontend
    res.json({
      city: location.name,
      country: location.country,
      temperature: weather.temperature_2m,
      feelsLike: weather.apparent_temperature,
      humidity: weather.relative_humidity_2m,
      windSpeed: weather.wind_speed_10m,
      weatherCode: weather.weather_code
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Something went wrong"
    });

  }

});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});