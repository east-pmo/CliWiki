/**
 * @fileOverview HTML5 features class definitions
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
			available = localStorage !== undefined;
		}
		catch (e) {
		}
		return available;
	}
}
