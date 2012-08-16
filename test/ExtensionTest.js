/** 
 * @fileOverview Extensiion function test
 * 
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version development
 */

//
// Class definition
//

/** 
 * DataExtensionTest
 * 
 * @class Test case definition class for Date class extension function.
 */
function DateExtensionTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'DateExtensionTest';
}
DateExtensionTest.prototype = {
	//
	// Test function
	//

    /**
     * Test Date#toISO8601String function.
     */
	testToISO8601String: function() {
		var testDate = new Date(2012, 6, 26, 16, 24, 30);
		Assert.assert(testDate.toISO8601String() === '2012-07-26T16:24:30+09:00');
		Assert.assert(testDate.toISO8601String() !== '2012-06-26T16:24:30+09:00');
	}
}

/** 
 * StringExtensionTest
 * 
 * @class Test case definition class for String class extension function.
 */
function StringExtensionTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'StringExtensionTest';
}
StringExtensionTest.prototype = {
	//
	// Test function
	//

    /**
     * Test String#addPrefixCharacter function.
     */
	testAddPrefixCharacter: function() {
		var testData = '22';
		Assert.assert(testData.addPrefixCharacter('0', 3) === '022');
		Assert.assert(testData.addPrefixCharacter('0', 2) === '22');
	}
}
