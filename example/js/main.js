require.config({
	baseUrl: '../../',
	paths: {
		primish: 'bower_components/primish',
		spritzy: 'index'
	},
	bundles: {
		'bower_components/primish/primish-min': [
			'primish/primish',
			'primish/emitter',
			'primish/options'
		]
	}
});

define(function(require){

	var Sptitzy = require('spritzy'),
		spritzy = new Sptitzy(document.querySelector('div.reader'), {
			text: 'The quick brown fox jumps over the lazy dog'
		});



});

