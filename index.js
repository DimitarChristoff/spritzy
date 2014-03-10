;(function(factory){
	// UMD wrap
	if (typeof define === 'function' && define.amd){
		define([
			'primish/primish',
			'primish/options',
			'primish/emitter'
		], factory);
	} else if (typeof module !== 'undefined' && module.exports){
		module.exports = factory(
			require('primish'),
			require('primish/options'),
			require('primish/emitter')
		);
	} else {
		this.spritzy = factory(this.primish, this.options, this.emitter);
	}
}).call(this, function(primish, options, emitter){

	// ORP cache
	var cache = {};

	return primish({

		implement: [options, emitter],

		options: {
			// roughly 600wpm
			baseSpeed: 80,
			// extra delay in ms per letter
			letterDelay: 10,
			// use the count / speed stats
			showStats: true,
			// allow changing speed, restarting etc
			showControls: true,
			// when done, re-start from beginning
			cycle: true,
			// use a word cache (processed ORP)
			cache: true,
			// reset shared cache when instantiating
			resetCache: false,

			// element selectors (CSS classes)
			pre: 'pre',
			orp: 'orp',
			post: 'post',
			count: 'count'
		},

		constructor: function(element, options){
			this.element = element;
			this.setOptions(options);

			/**
			 * Contains the current word stack we are reading.
			 * @type {Array}
			 */
			this.words = this.options.text ? this.getWords(this.options.text) : [];

			this.setElement();
			this.attachEvents();

			this.words.length && this.read();

			this.options.resetCache && (cache = {});
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
				el = document.createElement(tagName || 'div');
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

			return word.length <= 3
				? 1
				: word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g).length;
		},

		/**
		 * @description Returns an object with a breakdown of ORP, pre, post of a word and length
		 * @param {string} word
		 * @returns {object}
		 */
		getORP: function(word){
			if (this.options.cache && cache[word] != null)
				return cache[word];

			var count = this.getSyllableCount(word),
				obj = {
					orp: '', // Optimal Recognition Point
					pre: '&nbsp;',
					length: count,
					post: '&nbsp;'
				},
				pos;

			// one syllable is easy.
			if (count == 1){
				pos = (word.length / 2 >> 0);
				pos > 1 && word.length % 2 == 0 && pos--;
			}
			else {
				// lean left-ish at around 33%. Crude and probably wrong.
				pos = (word.length / 3 >> 0);
				pos > 2 && pos--;
			}

			pos && (obj.pre = word.substr(0, pos));
			obj.orp = word.charAt(pos);
			pos < word.length - 1 && (obj.post = word.substr(pos + 1));

			this.options.cache && (cache[word] = obj);

			return obj;
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
			return this.words = text.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s/);
		},

		/**
		 * @description Resets the counter of words read and the initial time.
		 */
		resetStats: function(){
			if (this.counter === null || this.time == null || this.elapsed == null){
				this.counter = 0;
				this.time = this.getNow();
				this.elapsed = 0;
				this.trigger('reset');
			}

			return this;
		},

		/**
		 * @description Start reading the word stack.
		 */
		read: function(words){
			words || (words = this.words.slice());

			var word = words.shift(),
				wordObj = this.getORP(word),
				k,
				o = this.options,
				count = this.count;

			this.resetStats();

			//todo: decopuple. move to micro templating.
			this.counter++;
			this.elapsed = (this.getNow() - this.time) / 1000 >> 0;
			o.showStats && (count.innerHTML = this.counter + ' words in ' + this.elapsed + 's');

			for (k in wordObj)
				this[k] && (this[k].innerHTML = wordObj[k]);

			this.trigger('read', word);

			// restart if needed
			words.length || o.cycle && (words = this.words.slice());

			// if anything left, set next read cycle.
			if (words.length){
				this.timer = setTimeout(this.read.bind(this, words), o.baseSpeed + word.length * o.letterDelay);
			}
			else {
				// fires when done reading current words array and no cycle is on.
				this.trigger('end');
			}

			return this;
		},

		/**
		 * @description Stops reading and resets stats.
		 */
		stop: function(){
			clearTimeout(this.timer);

			delete this.timer;
			delete this.counter;
			delete this.time;

			return this.trigger('stop');
		}

	});

});
