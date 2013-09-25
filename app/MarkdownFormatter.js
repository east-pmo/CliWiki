/**
 * @fileOverview Markdown Text formatter(using marked.js) class definitions
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2013 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.5.1.1(20130925)
 */

//
// Class definitions
//

/**
 * MarkdownFormatter
 *
 * @class Markdown text formatter
 * @see The <a href="https://github.com/chjj/marked">marked</a>. 
 */
function MarkdownFormatter() {
}
MarkdownFormatter.prototype = {
	//
	// Public functions.
	//

	/**
	 * Format contents
	 * 
	 * @param {String} contents Markuped text.
	 * @param {Boolean} allowFileScheme Allow file shceme in link format(ignore).
	 * @return {String} Formatted text.
	 */
	format: function(contents, allowFileScheme) {
		var formatted = marked(contents);
		formatted = this._translateWikiNameLink(formatted);
		formatted = this._translateWikiName(formatted);
		if (allowFileScheme !== false) {
			formatted = this._translateFileSchemeUrlToLink(formatted);
		}
		return formatted;
	},

	//
	// Private functions.
	//

	/**
	 * Translate Wiki name link.
	 * (Discard value of title attribute if exist)
	 * 
	 * @param {String} formatted HTML text.
	 * @return {String} Translated text.
	 */
	_translateWikiNameLink: function(formatted) {
		return formatted.replace(/<a\s+href=["']((?:[A-Z][a-z0-9]+){2,})["'](\s+title=["'][^"']*["'])?/g,
								 '<a href="#" class="wikiPage" title="$1"');
	},

	/**
	 * Translate Wiki name to anchor element(link).
	 * 
	 * @param {String} formatted HTML text.
	 * @return {String} Translated text.
	 */
	_translateWikiName: function(formatted) {
		var rules = [
			{
				match: /(\s?)((?:[A-Z][a-z0-9]+){2,})(\s?)/g,
				replace: '$1<a href="#" class="wikiPage" title="$2">$2</a>$3'
			},
			{
				match: /^((?:[A-Z][a-z0-9]+){2,})(\s?)/,
				replace: '<a href="#" class="wikiPage" title="$1">$1</a>$2'
			},
			{
				match: /(\s?)((?:[A-Z][a-z0-9]+){2,})$/,
				replace: '$1<a href="#" class="wikiPage" title="$2">$2</a>'
			}
		];
		return this._translateContents(formatted, function(contents) {
			var translated = contents;
			for (var index = 0; index < rules.length; ++index) {
				translated = translated.replace(rules[index].match,
												rules[index].replace);
			}
			return translated;
		});
	},

	/**
	 * Translate file scheme url to link.
	 * 
	 * @param {String} formatted HTML text.
	 * @return {String} Translated text.
	 */
	_translateFileSchemeUrlToLink: function(formatted) {
		var rules = [
			{
				match: /(\s)(file:\/\/\S+)(\s)/g,
				replace: '$1<a href="$2">$2</a>$3'
			},
			{
				match: /^(file:\/\/\S+)(\s)/g,
				replace: '<a href="$1">$1</a>$2'
			},
			{
				match: /(\s)(file:\/\/\S+)$/g,
				replace: '$1<a href="$2">$2</a>'
			}
		];
		return this._translateContents(formatted, function(contents) {
			var translated = contents;
			for (var index = 0; index < rules.length; ++index) {
				translated = translated.replace(rules[index].match,
												rules[index].replace);
			}
			return translated;
		});
	},

	/**
	 * Translate HTML contents using specified function.
	 * 
	 * @param {String} formatted HTML text.
	 * @param {Object} fn Function object to translate.
	 * @return {String} Translated text.
	 */
	_translateContents: function(formatted, fn) {
		var translated = '';

		var source = formatted;
		var r = null;
		while ((r = /<[^>]+>/.exec(source)) !== null) {
			var contents = '';
			if (0 < r.index) {
				contents = fn(source.substring(0, r.index));
			}
			translated += contents + r[0];
			source = source.substring(r.index + r[0].length);
		}
		return translated + source;
	}
};
