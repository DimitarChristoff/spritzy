spritzy
=======

It's like Spritz - only it's without all the science and the niceties. Yet, it kind of works.

In action - [http://fragged.org/spritzy/example/](http://fragged.org/spritzy/example/)

## usage

Here's an example under AMD:
```javascript
define(function(require){

	var textNode = document.querySelector('[data-spritzy]'),
		text = textNode.innerText || textNode.textContent;

	var Sptitzy = require('spritzy'),
		spritzy = new Sptitzy(document.querySelector('div.reader'), {
			text: text,
			cycle: false,
			cache: true
		});
});
```

## todo

Coming:
 - build (minified)
 - bookmarklet
 - controls + keyboard shortcuts
 