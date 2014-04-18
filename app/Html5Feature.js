/**
 * @fileOverview HTML5 features class definitions
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012,2014 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.6.1.1(20140418)
 */

//
// Class definition
//

/**
 * Html5Feature
 *
 * @class HTML5 feature static class
 */
var Html5Feature = {
	//
	// Public function
	//

	/**
	 * Check available of local storage.
	 *
	 * @return {Boolean} Result
	 */
	isLocalStorageAvailable: function() {
		var available = false;
		try {
			available = ((typeof localStorage) != 'undefined');
		}
		catch (e) {
		}
		return available;
	},

	/**
	 * Check running as Google Chrome Packaged Apps.
	 *
	 * @return {Boolean} Result
	 */
	runningAsChromePackagedApps: function() {
		return (typeof chrome !== 'undefined')
				&& 0 <= window.location.href.indexOf('chrome-extension://');
	}
}
