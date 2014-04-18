/**
 * @fileOverview Html5Feature spec description
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2013-2014 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.6.1.1(20140418)
 */

//
// Entry
//

describe('Html5Feature', function() {
	beforeEach(function() {
	});

	it('should local storage be avilable.', function() {
		expect(Html5Feature.isLocalStorageAvailable()).toBeTruthy();
	});
});