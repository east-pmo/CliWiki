/** 
 * @fileOverview Test runner
 * 
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version development
 */

//
// Class definitions
//

/** 
 * TestResult
 * 
 * @class Test result
 * @param {String} testName Test name.
 * @param {Boolean} result Test result.
 * @param {String} msg Additional message.
 */
function TestResult(testName, result, msg) {
    /**
     * Test name.
     * @return {String}
     */
	this.name = testName;

    /**
     * Result.
     * @return {Boolean}
     */
	this.result = result;

    /**
     * Additional message.
     * @return {String}
     */
	this.message = msg;
}
TestResult.prototype = {
}

/** 
 * TestResultSet
 * 
 * @class Test result set
 * @param {String} testName Test name.
 * @param {Array} result Array of test result .
 */
function TestResultSet(testName, results) {
    /**
     * Test name.
     * @return {String}
     */
	this.name = testName;

    /**
     * Results.
     * @return {Array}
     */
	this.results = results;
}
TestResultSet.prototype = {
	//
	// Public function
	//

    /**
     * Get success test count
     *
     * @param {Number} Success test count.
     */
	getSuccessTestCount: function() {
		var successCount = 0;
		for (var index = 0; index < this.results.length; index++) {
			if (this.results[index].result !== false) {
				++successCount;
			}
		}
		return successCount;
	},

	getSuccessRatio: function() {
		return (this.getSuccessTestCount() * 100.0 / this.results.length);
	}
}

/** 
 * TestRunner
 * 
 * @class Test runner
 */
function TestRunner() {
}
TestRunner.prototype = {
	//
	// Public function
	//

    /**
     * Run tests.
     *
     * @param {Array} tests Array of test class.
     */
	run: function(tests) {
		var results = new Array();
		var instance = this;
		for (var index = 0; index < tests.length; index++) {
			var testResult = this._runTest(tests[index]);
			results.push(new TestResultSet(tests[index].name !== undefined
											? tests[index].name
											: 'Test#' + (index + 1),
											testResult));
		}
		return results;
	},

	//
	// Private function
	//

    /**
     * Run test instance.
     *
     * @param {Object} test Test class instance.
     * @return {Array} Results.
     */
	_runTest: function(test) {
		var results = new Array();

		var initialized = false;
		try {
			if (test.setUp !== undefined) {
				test.setUp();
				initialized = true;
				results.push(this._makeResult('setUp', true, ''));
			}
			else {
				initialized = true;
			}
		}
		catch (e) {
			results.push(this._makeResult('setUp', false, e.message));
		}

		for (prop in test) {
			var testName = '(unknown)';
			try {
				if (prop.indexOf('test') === 0) {
					testName = prop;
					var result = false;
					if (initialized) {
						eval('test.' + prop + '()');
						result = true;
					}
					results.push(this._makeResult(testName, result, result ? '' : '(not tested)'));
				}
			}
			catch (e) {
				results.push(this._makeResult(testName, false, e.message));
			}
		}

		try {
			if (initialized) {
				if (test.tearDown !== undefined) {
					test.tearDown();
					results.push(this._makeResult('tearDown', true, ''));
				}
			}
		}
		catch (e) {
			results.push(this._makeResult('tearDown', false, 'tearDown() throw error.'));
		}

		return results;
	},

    /**
     * Make test result data.
     *
     * @param {String} testName Test name.
     * @param {Boolean} result Test result.
     * @param {String} msg Additional message.
     * @return {Object} Results.
     */
	_makeResult: function(testName, result, msg) {
		return new TestResult(testName, result, msg);
	}
}
