/**
 * @fileOverview Preference class definition
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.2.2.1(20120904)
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
	// Private field
	//

	/**
	 * Initialized flag.
	 * @type Boolean
	 */
	_initialized: false,

	/**
	 * Preference values.
	 * @type Object
	 */
	_values: {
		/**
		 * Allow file scheme flag.
		 * @type Object
		 */
		_allowFileScheme: false
	},

	//
	// Public function
	//

	/**
	 * Get application version.
	 *
	 * @return {String} Application version.
	 */
	getAppVersion: function() {
		return 'CliWiki Ver.0.2.2.1(20120904)';
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
	},

	/**
	 * Get allow file scheme.
	 *
	 * @return {Boolean} Allow file scheme flag.
	 */
	getAllowFileScheme: function() {
		Preference._loadValues();
		return Preference._values._allowFileScheme;
	},

	/**
	 * Set allow file scheme.
	 *
	 * @param {Boolean} Allow file scheme flag.
	 */
	setAllowFileScheme: function(flag) {
		Preference._values._allowFileScheme = flag;
		Preference._saveValues();
	},

	//
	// Private function
	//

	/**
	 * Load saved preferenec values.
	 */
	_loadValues: function() {
		if (Preference._initialized === false) {
			var values = localStorage.getItem('CliWiki_Preference');
			if (values !== null) {
				Preference._values = JSON.parse(values);
			}
			Preference._initialized = true;
		}
	},

	/**
	 * Save preferenec values.
	 */
	_saveValues: function() {
		if (Preference._initialized !== false
		&& Html5Feature.isLocalStorageAvailable()) {
			localStorage.setItem('CliWiki_Preference', JSON.stringify(Preference._values));
		}
	}
}
