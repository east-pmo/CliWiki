/**
 * @fileOverview PageSearcher class  test
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.3.1.1(20120919)
 */

//
// Class definition
//

/**
 * PageSearcherTest
 *
 * @class Test case definition class for PageSearcher class.
 */
function PageSearcherTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'PageSearcherTest';
}
PageSearcherTest.prototype = {
	//
	// Test function
	//

    /**
     * Test splitKeyword function.
     */
	testSplitKeyword: function() {
		var searcher = new PageSearcher();
		var keywords = searcher.splitKeyword('"Two words" Keyword  ');
		Assert.assert(keywords.length === 2, keywords.length.toString());
		Assert.assert(keywords[0] === 'Two words', keywords[0]);
		Assert.assert(keywords[1] === 'Keyword', keywords[1]);

		keywords = searcher.splitKeyword(' New function "Two words" Keyword  ');
		Assert.assert(keywords.length === 4, keywords.length.toString());
		Assert.assert(keywords[0] === 'New', keywords[0]);
		Assert.assert(keywords[1] === 'function', keywords[1]);
		Assert.assert(keywords[2] === 'Two words', keywords[2]);
		Assert.assert(keywords[3] === 'Keyword', keywords[3]);

		keywords = searcher.splitKeyword('New function Two words Keyword');
		Assert.assert(keywords.length === 5, keywords.length.toString());
		Assert.assert(keywords[0] === 'New', keywords[0]);
		Assert.assert(keywords[1] === 'function', keywords[1]);
		Assert.assert(keywords[2] === 'Two', keywords[2]);
		Assert.assert(keywords[3] === 'words', keywords[3]);
		Assert.assert(keywords[4] === 'Keyword', keywords[4]);

		keywords = searcher.splitKeyword('"New function Two words Keyword"');
		Assert.assert(keywords.length === 1, keywords.length.toString());
		Assert.assert(keywords[0] === 'New function Two words Keyword', keywords[0]);
		
		keywords = searcher.splitKeyword('"Two words Keyword" "New function"');
		Assert.assert(keywords.length === 2, keywords.length.toString());
		Assert.assert(keywords[0] === 'Two words Keyword', keywords[0]);
		Assert.assert(keywords[1] === 'New function', keywords[1]);
	}
}
