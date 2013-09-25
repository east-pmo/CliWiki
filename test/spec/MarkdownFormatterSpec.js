/**
 * @fileOverview MarkdownFormatter spec description
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

describe('MarkdownFormatter', function() {
	var formatter;

	beforeEach(function() {
		formatter = new MarkdownFormatter();
	});

	it('should be translate a wiki name link to internal style.', function() {
		var formatted = '';

		formatted = formatter.format('[Link Text](WikiName "Link Title")', false);
		expect(formatted).toContain('<a href="#" class="wikiPage" title="WikiName">Link Text</a>');

		formatted = formatter.format('[Link Text](TargetWikiName)', false);
		expect(formatted).toContain('<a href="#" class="wikiPage" title="TargetWikiName">Link Text</a>');
	});
	it('should be translate a wiki name to link.', function() {
		var formatted = '';

		formatted = formatter.format('Translate WikiName test.', false);
		expect(formatted).toContain('Translate <a href="#" class="wikiPage" title="WikiName">WikiName</a> test.');

		formatted = formatter.format('FirstWikiName and SecondWikiName', false);
		expect(formatted).toContain('<a href="#" class="wikiPage" title="FirstWikiName">FirstWikiName</a> and <a href="#" class="wikiPage" title="SecondWikiName">SecondWikiName</a>');

		formatted = formatter.format('Nothing to do.', false);
		expect(formatted).toContain('Nothing to do.');
		expect(formatted).not.toContain('</a>');
	});

	it('should be translate a file scheme url to link if needed.', function() {
		var formatted = '';

		formatted = formatter.format('See: file://C/foobar.txt', false);
		expect(formatted).toContain('See: file://C/foobar.txt');

		formatted = formatter.format('See: file://C/foobar.txt', true);
		expect(formatted).toContain('See: <a href="file://C/foobar.txt">file://C/foobar.txt</a>');

		formatted = formatter.format('See: file://C/foobar.txt to determine.', true);
		expect(formatted).toContain('See: <a href="file://C/foobar.txt">file://C/foobar.txt</a> to determine.');
		
		formatted = formatter.format('file://C/foobar.txt to see.', true);
		expect(formatted).toContain('<a href="file://C/foobar.txt">file://C/foobar.txt</a> to see.');
	});
});