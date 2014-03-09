define(function(require){

	var primish = require('primish/primish'),
		options = require('primish/options'),
		emitter = require('primish/emitter');

	return primish({

		implement: [options, emitter],

		options: {
			baseSpeed: 80,
			showStats: true,
			showControls: true,
			cycle: true,
			pre: 'pre',
			orp: 'orp',
			post: 'post',
			count: 'count'
		},

		constructor: function(element, options){
			this.element = element;
			this.setOptions(options);
			this.text = this.options.text ? this.getWords(this.options.text) : '';
			this.setElement();
			this.attachEvents();
			this.text && this.startReading();
			this.trigger('ready');
		},

		/**
		 * @private
		 * @param {string} className
		 * @param {string=} tagName optional tag, reverts to div
		 * @returns {*}
		 */
		makeElement: function(className, tagName){
			//todo: move to templating.
			var el = this.element.querySelector('.' + className);
			if (!el){
				document.createElement(tagName || 'div');
				el.className = className;
				this.element.appendChild(el);
			}
			this[this.cleanText(className)] = el;

			return this;
		},

		setElement: function(){
			var o = this.options;
			this.makeElement(o.pre);
			this.makeElement(o.orp);
			this.makeElement(o.post);
			this.makeElement(o.count);
			return this;
		},

		attachEvents: function(){
			//todo: attach dom events and controls.
		},

		/**
		 * @private
		 * @param {string} t text to clean
		 * @returns {string|}
		 */
		cleanText: function(t){
			return t.replace(/[^a-zA-Z0-9\s]/g, '');
		},

		/**
		 * @description gets a rough count of the syllables in a word (en) to determine
		 * likely ORP routine.
		 * @param {string} word
		 * @returns {number}
		 */
		getSyllableCount: function(word){
			// syllable count.
			word = word.toLowerCase();
			if (word.length <= 3)
				return 1;

			// cleanup
			word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
			word = word.replace(/^y/, '');
			return word.match(/[aeiouy]{1,2}/g).length;
		},

		/**
		 * @description Returns an object with a breakdown of ORP, pre, post of a word and length
		 * @param {string} word
		 * @returns {object}
		 */
		getORP: function(word){
			var s = this.getSyllableCount(word),
				o = {
					length: s
				},
				p;

			// one syllable is easy.
			if (s == 1){
				p = (word.length / 2 >> 0);
				p > 1 && word.length % 2 == 0 && p--;
				o.pre = '&nbsp;';
				p && (o.pre = word.substr(0, p));
				o.orp = word.charAt(p);

				o.post = '&nbsp;';
				p < word.length - 1 && (o.post = word.substr(p + 1));
			}
			else {
				p = (word.length / 3 >> 0);
				p > 2 && p--;
				// p > 1 && w.length % 2 == 0 && p--;
				o.pre = '&nbsp;';
				p && (o.pre = word.substr(0, p));
				o.orp = word.charAt(p);

				o.post = '&nbsp;';
				p < word.length - 1 && (o.post = word.substr(p + 1));

			}
			return o;
		},

		/**
		 * @description Returns unix time now via Date.now if available or normal new Date constructor
		 * @returns {number}
		 */
		getNow: (function(){
			return 'now' in Date ? Date.now : function(){
				return +new Date;
			}
		}()),

		/**
		 * @description Sets the text array being read to a cleaned version of the passed text.
		 * @param {string} text
		 * @returns {Array}
		 */
		getWords: function(text){
			return this.text = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s/);
		},

		/**
		 * @description Resets the counter of words read and the initial time.
		 */
		setStats: function(){
			this.counter == null && (this.counter = 0);
			this.time == null && (this.time = this.getNow());
			return this;
		},

		/**
		 * @description Start reading the word stack.
		 */
		startReading: function(){
			var words = this.words.slice(),
				word = words.shift(),
				wordObj = this.getORP(word),
				k;

			this.setStats();
			this.options.showStats &&
			(this.count.innerHTML = 'Speed: ' + ++this.counter + ' words in ' + ((this.getNow() - this.timer) / 1000 >> 0) + 's');

			for (k in wordObj)
				this[k] && (this[k].innerHTML = wordObj[k]);

			// restart
			words.length || this.options.cycle && (words = this.words.slice());

			words.length && (this.timer = setTimeout(this.startReading.bind(this), this.options.baseSpeed + word.length * 10));

			return this;
		},

		/**
		 * @description Stops reading and resets stats.
		 */
		stopReading: function(){
			clearTimeout(this.timer);
			delete this.timer;
			delete this.counter;
			delete this.time;
			return this;
		}

	});
});
