# When Does the Bus Leave

This is a little hobby project of min just keeping track on when the bus leaves the bus stop by my house so I don’t have to check the time table. Nerdy I know. [What does it do](#what-does-it-do)

## Requirements
* Blink(1) from ThingM - https://blink1.thingm.com/
* Node.js
* API key for SL’s (Stockholms bus service) real time API. You can get it at: www.trafiklab.se
### Optionals
* Raspberry Pi with connectivity
* API Key for SL’s Site Ids (it’s probably a simpler way to get a hold of the id)

## Installation
Get the code

` > git clone https://github.com/nippe/when-does-the-bus-leave.git`

Install packages

` > npm install`

*Checkout info on node-blink1 (which this project depends on) and node versions: https://github.com/todbot/blink1/tree/master/nodejs*

Add a file for API keys, named keys.js:
```
module.exports = {
	sites: ‘<api-key for sites api>’,
	realtimeinfo: ‘<api-key for realtime info>’
};
```

Configure your bus stop:

```
var keys = require(‘./keys’);

module.exports = {
	realtimedepatures: {
		api_key: keys.realtimeinfo,
		sited: ‘1868’,     // Site Id of your station
		time window: ’20’, // time in minutes it gets departures for
		direction: ‘2’     // the direction of your ride
	},
	station_search: {
		api_key: keys.sites
	}
};
```

Run it

` > node busStop.js`

## Tested on
* Raspberry Pi 2
* MacBook Pro (El Capitan)

## What does it do?
My implemation checks for departures regularly. When it's 10 minutes or less it lights the blink(1) and then changes colors the colser to departure it comes. Last minute it blinks ramdomly. (All colors will change and be tweaked). Then it turns the light off unitl it's less then 10 minutes to the next departure.

This way I don't have to check the departures and keeping track of the time when trying to get the kids out the door in the mornings.
