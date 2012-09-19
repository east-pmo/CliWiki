/**
 * @fileOverview CliWiki Test entry
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
// Entry
//

$(function() {
	CliWikiFooterUI.getAppVersionElement().text(Preference.getAppVersion());

	var tests = [
		new FormatUtilitiesTest(),
		new FormatterCreatorTest(),
		new TextFormatterTest(),
		new ListFormatterTest(),
		new TextCatalogueTest(),
		new PageSearcherTest(),
		new DateExtensionTest(),
		new StringExtensionTest()
	];
	var testRunner = new TestRunner();
	var results = testRunner.run(tests);

	var resultArea = $('article');
	var wholeResult = $('<table></table>');
	resultArea.append(wholeResult);
	wholeResult.append('<tr><th>実施</th><td>' + new Date().toISO8601String() + '</td></tr>')

	var totalTestCount = 0;
	var totalSuccessCount = 0;
	var testIndex = $('ul#testList');
	jQuery.each(results, function() {
		testIndex.append('<li><a href="#' + this.name + '">' + this.name +  '</li>');

		var heading = this.name;
		heading += ' - ';
		heading += this.getSuccessTestCount();
		heading += ' / ';
		heading += this.results.length;
		heading += '(' + this.getSuccessRatio() + '%)';

		resultArea.append('<h2 id="' + this.name + '">' + heading + '</h2>');

		var table = $('<table></table>');
		table.append('<thead><tr><th>結果</th><th>テスト</th><th>メッセージ</th></tr></thead>');
		var tbody = $('<tbody></tbody>');
		totalTestCount += this.results.length;
		jQuery.each(this.results, function() {
			tbody.append('<tr><td>'
						 + (this.result ? '○' : '×')
						 + '</td><td>'
						 + this.name
						 + '</td><td>'
						 + this.message
						 + '</td></tr>');
			if (this.result) {
				++totalSuccessCount;
			}
		});
		table.append(tbody);
		resultArea.append(table);
	});

	wholeResult.append('<tr><th>結果</th><td>'
					   + totalSuccessCount + '/' + totalTestCount
					   + '(' + (totalSuccessCount * 100 / totalTestCount)
					   + '%)</td></tr>')
});
