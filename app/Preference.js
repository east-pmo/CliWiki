/**
 * @fileOverview Preference class definition
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.2.1.3(20120815)
 */

//
// Class definition
//

/** 
 * Preference
 * 
 * @class Preference information static class
 */
var Preference = {
	//
	// Public function
	//

	/**
	 * Get application version.
	 *
	 * @return {String} Application version.
	 */
	getAppVersion: function() {
		return 'CliWiki Ver.0.2.1.3(20120815)';
	},

	/**
	 * Get language.
	 *
	 * @return {String} Language.
	 */
	getLanguage: function() {
		return 'ja';
	},

	/**
	 * Get max count of history
	 *
	 * @return {Number} Max count of history
	 */
	getMaxHistory: function() {
		return 1000;
	},

	/**
	 * Get preview auto update interval(ms).
	 *
	 * @return {Number} Preview auto update interval(ms).
	 */
	getPreviewUpdateIntervalMs: function() {
		return 100;
	}
}
