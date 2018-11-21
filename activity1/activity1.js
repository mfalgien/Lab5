var express = require('express');
var bParse = require('body-parser');
var calc = require('./calc.js');
var path = require("path");

var calc = new calc();
var app = express();
app.use(bParse.urlencoded({ extended: true }));
app.use(bParse.json());

app.locals.calcValue = 0;
app.locals.opStack = [];

app.listen(8088);

app.get('/', function (req, res) {
	
	res.set({ 'Cache-Control': 'no-cache, no-store' });
	res.status(200);
	res.type('html');
	//res.send(calc);
	res.sendFile(path.join(__dirname + '/main.html')); 
	
	
});

app.get('/api', function (req, res) {
	res.set({ 'Cache-Control': 'no-cache, no-store' });
	res.status(200);
	res.type('html');
	//res.send(calc);
	res.sendFile(path.join(__dirname + '/api.html')); 
});

app.post('/add', function (req, res) {
	console.log(req.body);
	var num = parseInt(req.body.value);
	console.log(num);
	if(isNaN(num)) {
		error500(req, res);
		return;
	}

	app.locals.calcValue += parseInt(req.body.value);
	console.log("add val: " + app.locals.calcValue);
	app.locals.opStack = calcOperation({operation:'+', operand:parseInt(req.body.value), ip:req.ip, user:req.headers['user-agent']});
	res.send(calc);
	res.end();
});

app.post('/pop', function (req, res) {
	if (calc.getStack().length > 0) {
		calc.pop();
		app.locals.calcValue = calc.getCurrVal();
		app.locals.opStack = calc.getStack();
	}
	res.send(calc);
	res.end();
});

app.get('/pop', function (req, res) {
	if (calc.getStack().length > 0) {
		calc.pop();
		app.locals.calcValue = calc.getCurrVal();
		app.locals.opStack = calc.getStack();
	}
	res.send(calc);
	res.end();
});

app.get('/reset', function (req, res) {
	app.locals.calcValue = 0;
	app.locals.opStack = [];
	calc.reset();
	res.status(200);
	res.send(calc);
	res.end();
});

app.post('/sub', function (req, res) {
	app.locals.calcValue -= parseInt(req.body.value);
	app.locals.opStack = calcOperation({operation:'-', operand:parseInt(req.body.value), ip:req.ip, user:req.headers['user-agent']});
	res.send(calc);
	res.end();
});

app.get('/history', function(req, res) {
	res.send(calc);
	res.end();
});

app.get('/value', function(req, res) {
	var obj = {"value" : calc.currVal}
	res.send(obj);
	res.end();
});

function getRequestObject() {
	if (window.XMLHttpRequest) {
		return (new XMLHttpRequest());
	} else {
		return (null);
	}
}

app.get('/subtract', function(req, res) {
	error405(req, res);
});

app.get('/add', function(req, res) {
	error405(req, res);
});

app.post('/reset', function(req, res) {
	error405(req, res);
});

app.post('/history', function(req, res) {
	error405(req, res);
});

app.post('/value', function(req, res) {
	error405(req, res);
});

app.all('/*', function(req, res) {
	error404(req, res);
});

function error405(req, res) {
		var obj = {"Status Code" : 405, "Message" : "Method Not Allowed"};
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(405);
		res.type('html');
		res.send(obj);
}

function error500(req, res) {
		var obj = {"Status Code" : 500, "Message" : "Internal Server Error"};
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(500);
		res.type('html');
		res.send(obj);
}

function error404(req, res) {
		var obj = {"Status Code" : 404, "Message" : "Not Found"};
		res.set({'Cache-Control': 'no-cache, no-store'});
		res.status(404);
		res.type('html');
		res.send(obj);
}

function calcOperation(dict) {
	calc.calc(dict);
	app.locals.calcValue = calc.getCurrVal();
	app.locals.opStack = calc.getStack();
}





