var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');

var config = require('./config');

function checkTimeTable(){

	console.log('CTT');
	request(getTimetableQueryObject())
		.then(getTimeToNextBus);

	setTimeout(checkTimeTable, 120000);
}


function getTimetableQueryObject() {
	var api_key = config.realtimedepatures.api_key;
	var siteid = config.realtimedepatures.siteid;
	var timewindow = config.realtimedepatures.timewindow;
	return {
		url: 'http://api.sl.se/api2/realtimedepartures.json',
		qs: {
			key: api_key,
			siteid: siteid,
			timewindow: timewindow
		},
		method: 'GET'
	};
}


function getTimeToNextBus(reply) {
	var data = JSON.parse(reply[0].body);
	//var data = JSON.parse(body);
	//console.log(body);
	console.log(data.ResponseData.Buses);
}

function theThenDebugger() {
	console.log('Finite'.green);
}

checkTimeTable();
