/**
 * @fileOverview {String} class extension
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.3.1.1(20120919)
 */

/**
 * Trim whitespace.
 *
 * @return {String} Trimed string.
 */
String.prototype.trim = function() {
	return this.replace(/^ +| +$/g, '');
}

/**
 * Add prefix character.
 *
 * @param {String} prefixChar character to add
 * @param {Number} maxLength Max length of result
 * @return {String} result
 */
String.prototype.addPrefixCharacter = function(prefixChar, maxLength) {
	var result = new String();
	for (var index = 0; index < (maxLength - this.length); index++) {
		result += prefixChar;
	}
	result += this;
	return result.substring(result.length - maxLength);
}

/**
 * Escape regular expression meta character.
 *
 * @return {String} Escaped string.
 */
String.prototype.escapeRegExpMetaChar = function() {
	var metachars = /([\[\]\{\}\(\)\\\|\^\$\.\*\+\?])/g;
	return this.replace(metachars, '\\$1');
}
