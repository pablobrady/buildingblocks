var express = require('express');
var app = express();

app.get('/', function(request, response) {
	response.send('ok');
});

app.listen(3000);
