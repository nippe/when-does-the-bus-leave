var keys = require('./keys');

module.exports = {
	realtimedepatures: {
		api_key: keys.realtimeinfo,
		siteid: '1868',
		timewindow: '20',
		direction: '2'
	},
	station_search: {
		api_key: keys.sites
	}
};
