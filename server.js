const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const apiRouter = require('./router.js');
const hostname = 'localhost';
const port = 6660;

app.use(rawBody);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(apiRouter);

var server = app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function rawBody(req, res, next) {
	if(req.headers['content-type'] != 'application/json'){
	  req.setEncoding('utf8');
	  req.rawBody = '';
	  req.on('data', function(chunk) {
	    req.rawBody += chunk;
	  });
	  req.on('end', function(){
	    next();
	  });
	} else next();
}