'use strict';

var path = require('path');

module.exports = function(grunt){
	grunt.initConfig({
		express: {
			spritzy: {
				options: {
					port: 8000,
					bases: [path.resolve('./'), path.resolve('./bower_components')],
					//serverreload: true,
					open: 'http://localhost:8000/example/'
					//background: !true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', [
		'express',
		'express-keepalive',
	]);
};
