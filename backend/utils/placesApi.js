const axios = require("axios");
require('dotenv').config();

async function searchPlaces(location, keyword) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(keyword)}&key=${apiKey}&limit=5&pretty=1&no_annotations=1&countrycode=pk`;

  try {
    const response = await axios.get(url);

    return response.data.results.map(place => ({
      name: place.formatted,
      address: place.formatted,
      phone: 'N/A', // OpenCage API does not directly provide phone numbers
      booking_link: 'N/A' // OpenCage API does not directly provide booking links
    }));
  } catch (error) {
    console.error("Error searching places with OpenCage API:", error.response ? error.response.data : error.message);
    throw new Error("Failed to search places.");
  }
}

module.exports = { searchPlaces };
