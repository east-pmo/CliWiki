/**
 * @fileOverview TextCatalogue function test
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
 * TextCatalogueTest
 *
 * @class Test case definition class for TextCatalogue class function.
 */
function TextCatalogueTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'TextCatalogueTest';
}
TextCatalogueTest.prototype = {
	//
	// Test function
	//

    /**
     * Test getText function.
     */
	testGetText: function() {
		var catalogue = new TextCatalogue('ja');
		var text = catalogue.getText('Keyword');
		Assert.assert(text === 'キーワード', text)
		text = catalogue.getText('Page name');
		Assert.assert(text === 'ページ名', text)
	}
}
