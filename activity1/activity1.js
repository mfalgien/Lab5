/* SER 421 Lab 3
 *
 * Reference Attributes: Kevin Gary, Brad Dayley
 *
 * EJS Views referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/templates/express_templates.js
 *
 * Body-parser referenced from:
 * https://github.com/kgary/ser421public/blob/master/NodeExpress/express_post.js
 */
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

app.post('/add', function (req, res) {
	console.log(req.body);
	app.locals.calcValue += parseInt(req.body.value);
	console.log("add val: " + app.locals.calcValue);
	app.locals.opStack = calcOperation({operation:'+', operand:parseInt(req.body.value), ip:req.ip, user:req.headers['user-agent']});
	res.send(calc);
	res.end();
});

app.post('/sub', function (req, res) {
	console.log(req.body);
	app.locals.calcValue -= parseInt(req.body.value);
	console.log("Local calc: " + app.locals.calcValue);
	app.locals.opStack = calcOperation({operation:'-', operand:parseInt(req.body.value), ip:req.ip, user:req.headers['user-agent']});
	res.send(calc);
	res.end();
});

function getRequestObject() {
	if (window.XMLHttpRequest) {
		return (new XMLHttpRequest());
	} else {
		return (null);
	}
}

/*
 * Handle add, subtract, and reset calls
 *
 * isNaN() referenced from:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
 */




function calcOperation(dict) {
	calc.calc(dict);
	app.locals.calcValue = calc.getCurrVal();
	app.locals.opStack = calc.getStack();
}



