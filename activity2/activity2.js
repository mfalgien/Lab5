var express = require('express');
var bParse = require('body-parser');
var path = require("path");

var app = express();
var apiKey = 'e6e5c090cdd34f40b72233758181811';
var site = 'http://api.apixu.com/v1/current.json?';
app.use(bParse.urlencoded({ extended: true }));
app.use(bParse.json());

app.listen(8088);

app.get('/', function (req,res){
	res.set({ 'Cache-Control': 'no-cache, no-store' });
	res.status(200);
	res.type('html');
	res.sendFile(path.join(__dirname + '/main.html')); 
});
