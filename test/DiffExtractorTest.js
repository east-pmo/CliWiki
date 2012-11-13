/**
 * @fileOverview DiffExtractor and related class test
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.4.1.1(20121113)
 */

//
// Class definition
//

/**
 * DiffExtractorTest
 *
 * @class Test case definition class for DiffExtractor class.
 */
function DiffExtractorTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'DiffExtractorTest';
}
DiffExtractorTest.prototype = {
	//
	// Test function
	//

    /**
     * Test extract function.
     */
	testExtract1: function() {
		var extractor = new DiffExtractor();

		var lhs = [
			'1st line',
			'2nd line',
			'3rd line'
		];
		var rhs = lhs;
		var sequences = extractor.extract(lhs, rhs);
		Assert.assert(sequences !== null, 'result is null');
		Assert.assert(sequences.length === 1, 'result count is invalid: ' + sequences.length);
		for (var index = 0; index < sequences.length; index++) {
			Assert.assert(sequences[index].part === DiffPartType.SHARE, sequences[index].part.toString());
		}

		rhs = [
			'1st line',
			'2nd line(Modified)',
			'3rd line'
		];
		sequences = extractor.extract(lhs, rhs);
		Assert.assert(sequences !== null, 'result is null');
		Assert.assert(sequences.length === 4, 'result count is invalid: ' + sequences.length);
		Assert.assert(sequences[0].part === DiffPartType.SHARE,
					'Part type is invalid: ' +  sequences[0].part.toString());
		Assert.assert(sequences[1].part == DiffPartType.FROM,
					'Part type is invalid: ' +  sequences[1].part.toString());
		Assert.assert(sequences[2].part == DiffPartType.TO,
					'Part type is invalid: ' +  sequences[2].part.toString());
		Assert.assert(sequences[3].part == DiffPartType.SHARE,
					'Part type is invalid: ' +  sequences[3].part.toString());
	},

	testExtract2: function() {
		var extractor = new DiffExtractor();

		var lhs = ['Edit test page for release'];
		var rhs = 'Edit test page for release\nThis is add line for test.\nThis is add line for test too.'.split('\n');
		var sequences = extractor.extract(lhs, rhs);
		Assert.assert(sequences !== null, 'result is null');
		Assert.assert(sequences.length === 2, 'result count is invalid: ' + sequences.length);
		Assert.assert(sequences[0].part === DiffPartType.SHARE,
					'Part type is invalid: ' + sequences[0].part.toString());
		Assert.assert(sequences[1].part === DiffPartType.TO,
					'Part type is invalid: ' +  sequences[1].part.toString());
	}
}
