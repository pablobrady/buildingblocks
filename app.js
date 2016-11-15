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
	client.auth( rtg.auth.split(":")[1] );
	client.select( 0 );  // Heroku/RedisToGo free -- only 0 available

} else {
	var client = redis.createClient(); // See www.npm.org/package/redis/
	client.select( 0 ); // Pick database id# (but only '0' on free version; (process.env.NODE_ENV || 'development').length)

}
	// "Development", or 11 length
	// "Production",  or 10 "
	// "Test",        or 4  "
// End Redis Connection




app.get('/cities', function(request, response) {
	client.hkeys('cities', function(error, names) {
		if(error) throw error;

		response.json(names);
	})
});

app.get('/cities/:name', function(request, response) {
	client.hget('cities', request.params.name, function(error, description) {
		if(error) throw error;

		response.render('show.ejs',
			{
				city: {
					name: request.params.name,
					description: description
				}
			});

	})
});



app.post('/cities', urlEncoded, function(request, response) {
	var newCity = request.body;
	client.hset('cities', newCity.name, newCity.description, function(error) {
		if(error) throw error;

		if( !newCity.name || !newCity.description ) {
			response.sendStatus(400);
			console.log("SENDING STATUS 400!");
			return false;

		}

		response.status(201).send(newCity.name);
		console.log("SENDING STATUS 201!");

	});
});

app.delete('/cities/:name', urlEncoded, function(request, response) {
console.log("DELETE:  ", request.params.name);
	client.hdel('cities', request.params.name, function(error) {
		if(error) throw error;

		response.sendStatus('204');
	});
});



module.exports = app;
