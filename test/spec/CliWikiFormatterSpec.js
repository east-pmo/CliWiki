/**
 * @fileOverview CliWikiFormatter spec description
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2013 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.5.1.1(20130925)
 */

//
// Entry
//

describe('CliWikiFormatter', function() {
	var formatter;

	beforeEach(function() {
		formatter = new CliWikiFormatter();
	});

	it('should be translate a wiki name to link.', function() {
		var formatted = '';

		formatted = formatter.format('Translate WikiName test.', false);
		expect(formatted).toContain('Translate <a href=\'#\' class=\'wikiPage\' title=\'WikiName\'>WikiName</a> test.');

		formatted = formatter.format('Translate WikiName', false);
		expect(formatted).toContain('Translate <a href=\'#\' class=\'wikiPage\' title=\'WikiName\'>WikiName</a>');

		formatted = formatter.format('WikiName translation', false);
		expect(formatted).toContain('<a href=\'#\' class=\'wikiPage\' title=\'WikiName\'>WikiName</a> translation');
	});
});