var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var colors = require('colors');
var _ = require('lodash');
var Blink1 = require('node-blink1');
var blink1;

var config = require('./config');
var pollIntervall = 120000;

try {
  blink1 = new Blink1();
} catch (err) {
  if (err.message === 'No blink(1)\'s could be found') {
    blink1 = require('./fake-blink1');
  } else {
    throw err;
  }
}


function checkTimeTable() {
  var useTimeConstriants = config.settings.use_time_constriants ||  false;

  isItAValidTime(new Date(), useTimeConstriants)
    .then(getSlDataFromApi)
    .then(getTimeToNextBus)
    .then(blinkTheBlink)
    .catch(function(err) {
      console.log(err.message.red);
    })
    .then(setNewTimeout);
}

function getSlDataFromApi(indata) {
  return request(getTimetableQueryObject());
}

function setNewTimeout() {
  console.log('Setting tiemout ' + pollIntervall);
  setTimeout(checkTimeTable, pollIntervall);
}

function isItAValidTime(currentTime, usingTimeSlots) {
  return new Promise(function(resolve, reject) {
    var theHour = currentTime.getHours();
    if (!usingTimeSlots || (theHour >= 6 && theHour < 9)) {
      resolve(true);
    } else {
      blink1.off();
      pollIntervall = 5 * 60 * 1000;
      reject(new Error('Not in valid time slot'));
    }
  });
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
  return new Promise(function(resolve, reject) {
    var data = JSON.parse(reply[0].body);
    var bus = _.find(data.ResponseData.Buses, function(ttEntry) {
      return (ttEntry.JourneyDirection === 2);
    });

    if (bus && bus.DisplayTime) {
      var expected = new Date(bus.ExpectedDateTime + '+0100');
      var now = new Date();
      var diff = (expected - now) / 1000 / 60;
      resolve(diff);
    } else {
      pollIntervall = 8 * 60 * 1000;
      blink1.off();
      reject(new Error('No busses in the given time slot'));
    }
  });
}

function blinkTheBlink(timeToNextBus) {
  console.log(timeToNextBus.toString().yellow);
  if (timeToNextBus < 10.0) {
    pollIntervall = 30 * 1000;
    if (timeToNextBus > 8) {
      blink1.fadeToRGB(2000, 0, 255, 0);
    } else if (timeToNextBus > 5) {
      pollIntervall = 20 * 1000;
      blink1.fadeToRGB(5000, 69, 255, 0);
    } else if (timeToNextBus > 3) {
      pollIntervall = 15 * 1000;
      blink1.fadeToRGB(5000, 240, 230, 140);
    } else if (timeToNextBus > 1) {
      pollIntervall = 10 * 1000;
      blink1.fadeToRGB(5000, 255, 76, 19);
    } else if (timeToNextBus > 0) {
      pollIntervall = 5 * 1000;
      blink1.writePatternLine(200, 255, 0, 0, 0);
      blink1.writePatternLine(200, 0, 0, 0, 1);
      blink1.play(0);
    } else {
      blink1.fadeToRGB(7000, 0, 0, 0);
    }
  } else {
    pollIntervall = 2 * 60 * 1000;
    blink1.fadeToRGB(1000, 0, 255, 0, function() {
      blink1.fadeToRGB(1000, 0, 0, 0, function() {
        blink1.off();
      });
    });
  }
}


checkTimeTable();
