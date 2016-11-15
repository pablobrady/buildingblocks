var express = require('express');

var bodyParser = require('body-parser');
var urlEncoded = bodyParser.urlencoded({ extended: false });

// Redis Connection
var redis = require('redis');
if (process.env.REDISTOGO_URL) {
	var rtg    = require('url').parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(rtg.port, rtg.hostname);
	client.auth( rtg.auth.split(":")[1] );
	client.select( 0 );  // Heroku/RedisToGo free -- only 0 available

} else {
	var client = redis.createClient(); // See www.npm.org/package/redis/
	client.select((process.env.NODE_ENV || 'development').length); // Pick database id#

}
	// "Development", or 11 length
	// "Production",  or 10 "
	// "Test",        or 4  "
// End Redis Connection



var router = express.Router();


router.route('/')
	.get(function(request, response) {
		client.hkeys('cities', function(error, names) {
			if(error) throw error;

			response.json(names);
		})
	})

	.post(urlEncoded, function(request, response) {
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


router.route('/:name')   // Full path:  '/cities/:name'
	.delete(urlEncoded, function(request, response) {
		console.log("DELETE:  ", request.params.name);
		client.hdel('cities', request.params.name, function(error) {
			if(error) throw error;

			response.sendStatus('204');
		});
	})

	.get(function(request, response) {
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

module.exports = router;
