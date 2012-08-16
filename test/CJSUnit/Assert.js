/** 
 * @fileOverview Unit test Assert static class definition
 * 
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version development
 */

//
// Class definitions
//

/** 
 * Assert
 * 
 * @class Assertion static class
 */
var Assert = {
	//
	// Public function
	//

	/**
	 * Assert result.
	 *
	 * @param {Boolean} result Result to assert.
	 * @param {String} msg Additional message.
	 */
	assert: function(result, msg) {
		if (result == false) {
			throw new Error(this._getValidMessage(msg));
		}
	},

	/**
	 * Fail test.
	 *
	 * @param {String} msg Message.
	 */
	fail: function(msg) {
		throw new Error(this._getValidMessage(msg));
	},

	//
	// Private function
	//

	/**
	 * Get valid message.
	 *
	 * @param {String} msg Message.
	 * @return {String} Valie message.
	 */
	_getValidMessage: function(msg) {
		return (typeof msg == 'string' && msg != '' ? msg : 'Assertion failed.');
	}
}
