var request = require('supertest');
var app = require('./app');

describe('Requests to the root path', function() {

	it('Returns a 200 status code', function(done) {

		request(app)
			.get('/')
			.expect(200)
			.end(function(error) {
				if(error) throw error;
				else done();
				console.log('Done');
		});

	});


});


describe('Listing cities on /cities', function() {

	it('Returns 200 status code', function(done){

		request(app)
			.get('/cities')
			.expect(200, done);

	});


});
