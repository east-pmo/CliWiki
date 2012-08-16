/**
 * @fileOverview CliWiki Help entry
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012, EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.2.1.3(20120815)
 */

//
// Entry
//

$(function() {
	CliWikiFooterUI.getAppVersionElement().text(Preference.getAppVersion());

	var contentList = $('body div#content aside nav ul#contentList');
	contentList.empty();
	$('body div#content div#sectionContainer section').each(function() {
		var section = $(this);
		contentList.append('<li><a href="#' + section.attr('id') +  '">'+ section.find('h1').text() + '</a></li>');
	});
	var historyList = $('body div#content aside nav ul#historyList');
	historyList.empty();
	$('body div#content div#sectionContainer section#updateHistory h2').each(function() {
		var heading = $(this);
		historyList.append('<li><a href="#' + heading.attr('id') +  '">'+ heading.text() + '</a></li>');
	});
});
