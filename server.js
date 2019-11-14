const url = require('url');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const apiRouter = require('./api/router');
const hostname = 'localhost';
const port = 6660;
const catchAllHtml = "./html/404.html";
const filePermisiveUrls = {"/": "./html/app.html", "/favicon.ico": "./favicon.ico"};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use('/api', apiRouter);
app.get( "/*", sendFile);

var server = app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function sendFile(req, res){
  var filename = filePermisiveUrls[req.url],
      responseCode = 200;
  if( !filePermisiveUrls[req.url] )
    filename = catchAllHtml, responseCode = 404;
	fs.readFile(filename, function(err, data) {
		if(err){
			console.log(filename, ' not found');
			return res.send();
		} else {
      res.status(responseCode)
			res.set('Content-Type', 'text/html');
  		return res.send(data);
		}
	});
}