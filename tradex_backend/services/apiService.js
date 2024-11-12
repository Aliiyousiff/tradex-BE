// services/apiService.js

const axios = require('axios');

const API_KEY = process.env.API_KEY; // Load API key from environment variables
const BASE_URL = 'https://www.alphavantage.co';

// Function to get the price of a cryptocurrency
const getCryptoPrice = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/query`, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: symbol.toUpperCase(),
        to_currency: 'USD',
        apikey: API_KEY,
      },
    });

    const data = response.data['Realtime Currency Exchange Rate'];
    if (!data || !data['5. Exchange Rate']) {
      throw new Error(`Price data not available for symbol '${symbol}'.`);
    }

    const price = parseFloat(data['5. Exchange Rate']);
    return price;
  } catch (error) {
    console.error(
      'Error fetching market price:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Function to get the price of a stock
const getStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/query`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const data = response.data['Global Quote'];
    if (!data || !data['05. price']) {
      throw new Error(`Price data not available for symbol '${symbol}'.`);
    }

    const price = parseFloat(data['05. price']);
    return price;
  } catch (error) {
    console.error(
      'Error fetching market price:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Export functions based on asset type
module.exports = {
  getCryptoPrice,
  getStockPrice,
};