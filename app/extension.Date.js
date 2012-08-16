/**
 * @fileOverview {Date} class extension
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.2.1.3(20120815)
 */

/**
 * Make ISO 8601 string.
 *
 * @return {String} ISO 8601
 */
Date.prototype.toISO8601String = function() {
	var values = [
		this.getFullYear().toString(),
		'-',
		(this.getMonth() + 1).toString().addPrefixCharacter('0', 2),
		'-',
		this.getDate().toString().addPrefixCharacter('0', 2),
		'T',
		this.getHours().toString().addPrefixCharacter('0', 2),
		':',
		this.getMinutes().toString().addPrefixCharacter('0', 2),
		':',
		this.getSeconds().toString().addPrefixCharacter('0', 2),
		this.getISO8601TimezoneLiteral()
	];
	return values.join('');
}

/**
 * Make ISO 8601 timezone string.
 *
 * @return {String} ISO 8601 timezone string
 */
Date.prototype.getISO8601TimezoneLiteral = function() {
	var offset = this.getTimezoneOffset();
	var hour = Math.abs(this.getTimezoneOffset()) / 60;
	var min = Math.abs(this.getTimezoneOffset()) % 60;
	var values = [
		offset < 0 ? '+' : '-',
		hour.toString().addPrefixCharacter('0', 2),
		':',
		min.toString().addPrefixCharacter('0', 2)
	];
	return values.join('');
}
