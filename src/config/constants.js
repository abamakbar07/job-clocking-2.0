require('dotenv').config();

const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL,
    DEVICE_IP: process.env.DEVICE_IP,
    HEADERS: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      'Referer': 'http://jobclocking.apac.dsv.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  };
  
  module.exports = {
    API_CONFIG,
    SITE_ID: process.env.SITE_ID,
    EMPLOYER_ID: process.env.EMPLOYER_ID
  }; 