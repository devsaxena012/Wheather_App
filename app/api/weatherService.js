import axios from 'axios';

const API_KEY = "0c2b1f56f23c49f6b91141703251903";
const BASE_URL = 'https://api.weatherapi.com/v1';

// Fetch weather data
export const getWeather = async (city) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch city suggestions
export const getCitySuggestions = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
};
