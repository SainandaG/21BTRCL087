const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const NUMBERS = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand'
};

let window = [];
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIzNzkxMDQ1LCJpYXQiOjE3MjM3OTA3NDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQzM2JjNDMzLTcyNGUtNDZmMC05NTdkLWQwMDliZGIwODNlMSIsInN1YiI6IjIxYnRyY2wwODdAamFpbnVuaXZlcnNpdHkuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJBZmZvcmRtZWQiLCJjbGllbnRJRCI6IjQzM2JjNDMzLTcyNGUtNDZmMC05NTdkLWQwMDliZGIwODNlMSIsImNsaWVudFNlY3JldCI6IkJVWW1JWUltdUR4T2JSVnoiLCJvd25lck5hbWUiOiJTYWkgTmFuZGEgRyIsIm93bmVyRW1haWwiOiIyMWJ0cmNsMDg3QGphaW51bml2ZXJzaXR5LmFjLmluIiwicm9sbE5vIjoiMjFCVFJDTDA4NyJ9.r7D1Xtj0XGAARJaOGuhSOJ3vwErPEfk9pGTbfRGUjt0'; // Updated token

app.use(express.json());

app.post('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  const url = NUMBERS[type];
  
  if (!url) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    // Fetch numbers from the third-party API
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 500 // Set timeout to 500ms
    });

    const newNumbers = response.data.numbers;

    // Check for errors and valid numbers
    if (!Array.isArray(newNumbers)) {
      return res.status(500).json({ error: 'Failed to fetch numbers' });
    }

    // Add new numbers to the window and maintain the window size
    window = [...window, ...newNumbers].slice(-WINDOW_SIZE);

    // Calculate the average
    const avg = window.length > 0 ? (window.reduce((sum, num) => sum + num, 0) / window.length).toFixed(2) : 0;

    // Response
    res.json({
      windowPrevState: window.slice(0, -newNumbers.length),
      windowCurrState: window,
      numbers: newNumbers,
      avg: parseFloat(avg)
    });
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Average Calculator Service running on http://localhost:${PORT}`);
});
