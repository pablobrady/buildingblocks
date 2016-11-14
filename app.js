var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlEncoded = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

// Redis Connection
var redis = require('redis');

if (process.env.REDISTOGO_URL) {
	var rtg    = require('url').parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(rtg.port, rtg.hostname);
	client.auth( rtg.auth.split(":", [1]) );

} else {
	var client = redis.createClient(); // See www.npm.org/package/redis/
}

client.select( (process.env.NODE_ENV || 'development').length ); // Pick database id#
	// "Development", or 11 length
	// "Production",  or 10 "
	// "Test",        or 4  "
// End Redis Connection

// app.get('/', function(request, response) {
// 	response.send('OK'); // HTML format
// }); // Alt to using STATIC

app.get('/cities', function(request, response) {
	client.hkeys('cities', function(error, names) {
		if(error) throw error;

		response.json(names);
	})
});

app.post('/cities', urlEncoded, function(request, response) {
	var newCity = request.body;
	client.hset('cities', newCity.name, newCity.description, function(error) {
		if(error) throw error;

		response.status(201).send(newCity.name);
		console.log("SENDING STATUS 201!");


	});
});

module.exports = app;
