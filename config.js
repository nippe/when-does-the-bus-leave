var keys = require('./keys');

module.exports = {
	realtimedepatures: {
		api_key: keys.realtimeinfo,
		url: 'http://api.sl.se/api2/realtimedeparturesV4.json',
		siteid: 1868,
		timewindow: 20,
		direction: 2
	},
	station_search: {
		api_key: keys.sites
	},
	settings: {
		use_time_constriants: true
	}

};
