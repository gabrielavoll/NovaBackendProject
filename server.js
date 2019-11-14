const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();
const apiRouter = require('./router.js');
const hostname = 'localhost';
const port = 6660;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(apiRouter);

var server = app.listen(port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
