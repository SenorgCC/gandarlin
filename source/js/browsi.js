var browserify = require('browserify');
var bundler = browserify({
        ignore: ['jquery']
});

bundler.require('jquery');
bundler.add('main.js');

// Output file
bundler.bundle().pipe(process.stdout);
