'use strict';

var path = require('path');

module.exports = function(grunt){
	grunt.initConfig({
		project: {
			less: [
				'dist/less/pairs.less'
			]
		},

		express: {
			epik: {
				options: {
					server: path.resolve('dist/server/index'),
					port: 8000,
					bases: path.resolve('dist'),
					//serverreload: true,
					livereload: true,
					open: !true
					//background: !true
				}
			}
		},

		less: {
			epik: {
				files: {
					'dist/client/css/pairs.css': '<%= project.less %>'
				}
			}
		},

		watch: {
			less: {
				files: 'dist/less/pairs.less',
				tasks: ['less']
			}
		}

	});

	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'less',
		'express',
		//'express-keepalive',
		'watch'
	]);
};
