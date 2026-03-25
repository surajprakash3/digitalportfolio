const http = require('http');

http.get('http://localhost:5000/api/socials', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Raw JSON:", data);
  });
}).on('error', err => console.error(err));
