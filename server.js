const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');

const server = http.createServer(app);
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'app')));

app.use('/static/js/apps', express.static('app', {
    setHeaders: (res, path, stat) => {
      res.set('Content-Type', 'application/javascript');
    }
  }));

server.listen(PORT, () => {
    console.log(`Secure Server is running at http://localhost:${PORT}`);
});
