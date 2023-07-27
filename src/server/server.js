// Importing necessary modules
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const dotenv = require('dotenv');

// Loading environmental variables
dotenv.config();

// Setting up Express.js middlewares
app.use(express.static('dist')); // Serves static files from 'dist' directory
app.use(cors()); // Enables Cross Origin Resource Sharing

// Route to serve the base file of the application
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Route to handle weather queries
app.get('/weather', async (req, res) => {
  try {
    const { location, date, forecast } = req.query;

    const fetch = await import('node-fetch');

    // Construct the URL to fetch the location details from the Geonames API
    const geoNamesURL = `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;

    // Fetch the location details
    const geoNamesResponse = await fetch.default(geoNamesURL);
    const geoNamesData = await geoNamesResponse.json();
    const { lat, lng } = (geoNamesData.geonames && geoNamesData.geonames[0]) || {};

    // If latitude or longitude is not available, respond with an error
    if (!lat || !lng) {
        return res.status(400).json({ message: 'Location not found' }); 
    }

    // Construct the URL to fetch weather details from the Weatherbit API
    let weatherBitURL = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
    if (forecast === 'forecast') {
      weatherBitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&start_date=${date}&end_date=${date}&key=${process.env.WEATHERBIT_API_KEY}`;
    }

    // Fetch the weather details
    const weatherBitResponse = await fetch.default(weatherBitURL);
    const weatherBitData = await weatherBitResponse.json();
    let weatherData = weatherBitData.data && weatherBitData.data[0];

    // If forecast is unavailable or weather data is not available, use default weather data
    if (forecast === 'unavailable' || !weatherData) {
      weatherData = { temp: 20, weather: { description: 'clear sky' } };
    }

    const { temp, weather } = weatherData;

    // Construct the URL to fetch the location image from the Pixabay API
    const pixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(location)}&image_type=photo`;

    // Fetch the image details
    const pixabayResponse = await fetch.default(pixabayURL);
    const pixabayData = await pixabayResponse.json();
    let imageData = pixabayData.hits && pixabayData.hits[0];

    // If no image is available for the location, fetch a default image
    if (!imageData) {
      const defaultPixabayURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=earth&image_type=photo`;
      const defaultPixabayResponse = await fetch.default(defaultPixabayURL);
      const defaultPixabayData = await defaultPixabayResponse.json();
      imageData = defaultPixabayData.hits && defaultPixabayData.hits[0];

      if (!imageData) {
        return res.status(400).send({ message: 'No image available' });
      }
    }

    const imageUrl = imageData.webformatURL;

    // Send the response with temperature, weather details and the location image URL
    res.send({ temp, weather, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

// Detect if the environment is for testing
const isTestEnvironment = process.env.NODE_ENV === 'test';

let server;
// If testing, just listen on port 3000, otherwise also log the server start
if (isTestEnvironment) {
    server = app.listen(3000);
} else {
    server = app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}

// Export the server for testing
module.exports = server;
