var colors = require('colors');

module.exports = {
  off: function() {
    console.log('\t- Blink is turned off'.cyan);
  },
  fadeToRGB: function(time, r, g, b, cb) {
    console.log('\t- Blink is fading and then '.cyan + (cb ? 'call back'.cyan : 'nothing'.cyan) );
  },
  writePatternLine: function(time, r, g, b, cb) {
    console.log('\t- Blink is applying pattern and then '.cyan + (cb ? 'call back'.cyan : 'nothing'.cyan) );
  }
};
