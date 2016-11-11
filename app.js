var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlEncoded = bodyParser.urlencoded({ extended: false });

var cities = {
	"Lotopia":"Some description",
	"Caspiana":"Another description",
	"Indigo":"Last description"
};

app.use(express.static('public'));

// app.get('/', function(request, response) {
// 	response.send('OK'); // HTML format
// }); // Alt to using STATIC

app.get('/cities', function(request, response) {
	response.send( cities );
});

app.post('/cities', urlEncoded, function(request, response) {
	var newCity = request.body;
	cities[newCity.name] = newCity.description;
	response.status(201).send(cities);
	console.log("SENDING STATUS 201!");
});

module.exports = app;
