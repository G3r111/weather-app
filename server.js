const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;


// Serve static files
app.use(express.static(path.join(__dirname, "public")));


// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Weather API route
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({
      error: "City is required"
    });
  }

  try {

    // Request weather data from wttr.in
    const response = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      {
        headers: {
          "User-Agent": "weather-app"
        }
      }
    );


    const data = response.data;


    // Check if weather data exists
    if (
      !data.current_condition ||
      data.current_condition.length === 0
    ) {
      return res.status(404).json({
        error: "City not found"
      });
    }


    const current = data.current_condition[0];

    const nearestArea =
      data.nearest_area &&
      data.nearest_area[0];


    // City name
    const cityName =
      nearestArea?.areaName?.[0]?.value || city;


    // Country name
    const country =
      nearestArea?.country?.[0]?.value || "";


    // Send only the data our frontend needs
    res.json({
      city: cityName,
      country: country,

      temperature:
        Number(current.temp_C),

      feelsLike:
        Number(current.FeelsLikeC),

      humidity:
        Number(current.humidity),

      windSpeed:
        Number(current.windspeedKmph),

      weatherDescription:
        current.weatherDesc?.[0]?.value || "Unknown",

      weatherCode:
        Number(current.weatherCode)
    });


  } catch (error) {

    console.error(
      "WEATHER ERROR:",
      error.response?.data || error.message
    );


    res.status(500).json({
      error: "Unable to get weather data"
    });

  }
});


// Start server
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});