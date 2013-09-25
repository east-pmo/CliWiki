/**
 * @fileOverview Preference class definition
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012-2013 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.5.1.1(20130925)
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
	 * @type {Boolean}
	 */
	_initialized: false,

	/**
	 * Preference values.
	 * @type {Object}
	 */
	_values: {
		/**
		 * Display language.
		 * @type {String}
		 */
		_language: null,

		/**
		 * Allow file scheme flag.
		 * @type {Object}
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
		return 'CliWiki Ver.0.5.1.1(20130925)';
	},

	/**
	 * Get language.
	 *
	 * @return {String} Language.
	 */
	getLanguage: function() {
		Preference._loadValues();
		var lang = Preference._values._language !== null
					? Preference._values._language
					: window.navigator.language;
		if ((typeof lang == 'undefined') || lang === null || lang.length === 0) {
			lang = 'en';
		}
		return lang;
	},

	/**
	 * Get mark up style.
	 *
	 * @return {String} Mark up style.
	 */
	getMarkUpStyle: function() {
		Preference._loadValues();
		var style = Preference._values._markUpStyle !== null
					? Preference._values._markUpStyle
					: 'cliwiki';
		if ((typeof style == 'undefined') || style === null || style.length === 0) {
			style = 'cliwiki';
		}
		return style;
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
		return Html5Feature.runningAsChromePackagedApps() === false
				&& Preference._values._allowFileScheme;
	},

	/**
	 * Set display language.
	 *
	 * @param {String} Display language.
	 */
	setLanguage: function(lang) {
		Preference._values._language = lang;
		Preference._saveValues();
	},

	/**
	 * Set mark up style.
	 *
	 * @param {String} Mark up style.
	 */
	setMarkUpStyle: function(style) {
		Preference._values._markUpStyle = style;
		Preference._saveValues();
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
