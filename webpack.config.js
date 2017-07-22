const path = require('path');

module.exports = {
 entry: './src/js/app.js',
 output: {
   path: path.resolve(__dirname, 'bin'),
   filename: 'app.bundle.js'
 },
 resolve: {
    extensions: ['.js']
  }
};
