var express = require('express');
var app = express();

var pkg = require('../package.json');

app.get('/', function (req, res) {
  res.json({ app: 'example.js'});
});

// health check for web server
app.get('/health.txt', function (req, res) {
  res.write('OK');
  res.end();
});

// app version
app.get('/version', function (req, res, next) {
  res.json(pkg);
  res.end();
});

app.listen(3000);
console.log('Listening on port 3000');
