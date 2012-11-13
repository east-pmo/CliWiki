/**
 * @fileOverview CliWiki user interface class definitions
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
 * CliWikiFotterUI
 * 
 * @class CliWiki fotter UI definitions static class
 */
var CliWikiFooterUI = {
	//
	// Public function
	//

	/**
     * Get application version element
     * 
     * @return {Object} Application version element.
     */
	getAppVersionElement: function() {
		return $('footer#pageFooter p#version');
	}
}

/** 
 * CliWikiUI
 * 
 * @class CliWiki UI definitions static class
 */
var CliWikiUI = {
	//
	// Public function
	//

	/**
     * Get content list element
     * 
     * @return {Object} Content list element
     */
	getContentListElement: function() {
		return $('#sideBarMenu #pageIndex');
	},

	/**
     * Get recent update content element
     * 
     * @return {Object} Recent update content element
     */
	getRecentUpdateContentElement: function() {
		return $('#sideBarMenu #recentUpdateContent');
	},

	/**
     * Get presentation title element
     * 
     * @return {Object} Presentation title element
     */
	getPresentationTitleElement: function() {
		return $('h1#presentationTitle');
	},

	/**
     * Get presentation content element
     * 
     * @return {Object} Presentation content list element
     */
	getPresentationContentElement: function() {
		return $('div#presentationContent');
	},

	/**
     * Get source page name element
     * 
     * @return {Object} Source page name element
     */
	getSourcePageNameElement: function() {
		return $('span#sourcePageName');
	},

	/**
     * Get source title element
     * 
     * @return {Object} Source title list element
     */
	getSourceTitleElement: function() {
		return $('input#sourceTitle');
	},

	/**
     * Get source content element
     * 
     * @return {Object} Source content element
     */
	getSourceContentElement: function() {
		return $('textarea#sourceContent');
	},

	/**
     * Get content last update time element
     * 
     * @return {Object} Content last update time element
     */
	getContentLastUpdateTimeElement: function() {
		return $('time#contentLastUpdateTime');
	},

	/**
     * Get page list table body element.
     * 
     * @return {Object} Page list table body element.
     */
	getPageListTableBodyElement: function() {
		return $('section#pageList table tbody');
	},

	/**
     * Get update history table body element.
     * 
     * @return {Object} Page list table body element.
     */
	getUpdateHistoryTableBodyElement: function() {
		return $('section#updateHistory table tbody');
	},

	/**
     * Get page update history title element.
     * 
     * @return {Object} Page update history title element.
     */
	getPageUpdateHistoryTitleElement: function() {
		return $('#pageUpdateHistory span#pageUpdateHistoryPageName');
	},

	/**
     * Get page update history list element.
     * 
     * @return {Object} Page update history list element.
     */
	getPageUpdateHistoryListElement: function() {
		return $('#pageUpdateHistoryList');
	},

	/**
     * Get page difference view latest link element.
     * 
     * @return {Object} View latest link element.
     */
	getPageDifferenceViewLatestElement: function() {
		return $('#pageDifference #pageDifferenceViewLatest');
	},

	/**
     * Get page difference view update history link element.
     * 
     * @return {Object} View update history link element.
     */
	getPageDifferenceViewUpdateHistoryElement: function() {
		return $('#pageDifference #pageDifferenceViewUpdate');
	},

	/**
     * Get page difference title element.
     * 
     * @return {Object} Page update history title element.
     */
	getPageDifferenceTitleElement: function() {
		return $('#pageDifference span#pageDifferencePageName');
	},

	/**
     * Get page difference sequence element.
     * 
     * @return {Object} Page difference sequence element.
     */
	getPageDifferenceSequenceElement: function() {
		return $('#pageDifference tbody#pageDiffSequence');
	},

	/**
     * Get search result title element.
     * 
     * @return {Object} Search result title element.
     */
	getSearchResultTitleElement: function() {
		return $('section#searchResult span#searchResultKeyword');
	},

	/**
     * Get search result list element.
     * 
     * @return {Object} Search result list element.
     */
	getSearchResultListElement: function() {
		return $('section#searchResult #searchResultList');
	},

	/**
     * Get display language select element.
     * 
     * @return {Object} Display language select element.
     */
	getDisplayLanguageElement: function() {
		return $('section#preference select#displayLanguage');
	},

	/**
     * Get allow file scheme element.
     * 
     * @return {Object} Allow file scheme element.
     */
	getAllowFileSchemeElement: function() {
		return $('section#preference input#allowFileScheme');
	},

	/**
	 * Show alert message.
     *
     * @param {String} msg Alert message.
     */
	alert: function(msg) {
		var catalogue = new TextCatalogue(Preference.getLanguage());
		window.alert(catalogue.getText(msg));
	},

	/**
	 * Show confirm message.
     *
     * @param {String} msg Confirm message.
     */
	confirm: function(msg) {
		var catalogue = new TextCatalogue(Preference.getLanguage());
		return window.confirm(catalogue.getText(msg));
	},

	/**
     * Set up event handler
     *
     * @param {Object} app CliWikiApp instance.
     */
	setUpEventHandler : function(app) {
		this._setUpPageEditorEventHandler(app);

		$('nav button#showPageButton').on('click', function() {
			var wikiName = $('nav input#wikiName').val();
			app.changePage(wikiName);
		});
		$('nav input#wikiName').on('keyup', function() {
			var wikiName = $(this).val();
			if (0 < wikiName.length && FormatUtilities.isWikiName(wikiName)) {
				$('nav button#showPageButton').removeAttr('disabled');
			}
			else {
				$('nav button#showPageButton').attr('disabled', 'disabled');
			}
		});

		this._setUpPageHeaderEventHandler(app);
	},

    /**
     * Change display language.
     */
	changeDisplayLanguage: function() {
		var lang = Preference.getLanguage();
		$('body span[lang][lang!="' + lang + '"]').hide();
		$('body span[lang][lang="' + lang + '"]').show();

		var catalogue = new TextCatalogue(lang);
		$('input[placeholder]').each(function() {
			var elem = $(this);
			elem.attr('placeholder', catalogue.getText(elem.attr('title')));
		});
	},

    /**
     * Select section.
     *
     * @param {String} sectionId Section element id to show.
     */
	selectSection: function(sectionId) {
		$('section').hide().filter('#' + sectionId).show();
	},
	
	/**
     * Show editor.
     */
	showEditor: function() {
		$('menu button.presentation').hide();
		$('menu button.edit').show();
		$('#source').attr('open', 'open').show();
	},

	/**
     * Hide editor.
     */
	hideEditor: function() {
		$('menu button.edit').hide();
		$('menu button.presentation').show();
		$('#source').hide();
	},

	/**
     * Set page difference section header info.
     *
     * @param {Object} fromPage From page of comparison target.
     * @param {Object} toPage To page of comparison target.
     */
	setPageDifferenceHeaderInfo: function(fromRev, fromPage, toRev, toPage) {
		var sec = $('section#pageDifference');
		var fromTime = fromRev + ' : ' + fromPage.getLastUpdateTime();
		sec.find('span#pageDiffFromPageUpdateTime').text(fromTime);
		sec.find('span#pageDiffFromPageTitle').text(fromPage.title);
		var toTime = toRev + ' : ' + toPage.getLastUpdateTime();
		sec.find('span#pageDiffToPageUpdateTime').text(toTime);
		sec.find('span#pageDiffToPageTitle').text(toPage.title);
	},

	/**
     * Prepare search.
     */
	prepareSearch: function() {
		var section = $('section#searchResult');
		section.find('div#searchingMessage').show();
		section.find('div#foundMessage, div#notFoundMessage').hide();
		section.find('table#searchResultTable').hide();
	},

	/**
     * Set search result.
     *
     * @param {Number} totalPages Total page count.
     * @param {Number} foundPages Found page count.
     */
	setSearchResult: function(totalPages, foundPages) {
		var section = $('section#searchResult');
		section.find('div#searchingMessage').hide();
		if (foundPages === 0) {
			section.find('div#foundMessage').hide();
			section.find('div#notFoundMessage').show();
		}
		else {
			section.find('div#foundMessage').show();
			section.find('div#notFoundMessage').hide();
			section.find('table#searchResultTable').show();

			section.find('span.totalPages').text(totalPages);
			section.find('span.foundPages').text(foundPages);
		}
	},

	//
	// Private function
	//

	/**
     * Set up page header event handler
     *
     * @param {Object} app CliWikiApp instance.
     */
	_setUpPageHeaderEventHandler: function(app) {
		var globalMenu = $('header#pageHeader ul#globalMenu');

		var searchButton = globalMenu.find('form button#searchButton');
		searchButton.on('click', function() {
			var keyword = $('nav input#searchKeyword').val();
			if (0 < keyword.length) {
				app.search(keyword);
			}
		});
		globalMenu.find('input#searchKeyword').on('keyup', function() {
			var keyword = $(this).val();
			if (0 < keyword.length) {
				searchButton.removeAttr('disabled');
			}
			else {
				searchButton.attr('disabled', 'disabled');
			}
		});

		globalMenu.find('li a[title="FrontPage"]').on('click', function() {
			var anchor = $(this);
			if (anchor.attr('href') !== undefined) {
				app.selectPage(anchor.attr('title'));
			}
		});
		globalMenu.find('li a#pageListMenuItem').on('click', function() {
			app.selectPageList();
		});
		globalMenu.find('li a#updateHistoryMenuItem').on('click', function() {
			app.selectUpdateHistory();
		});

		globalMenu.find('li#preferenceMenuItem a').on('click', function() {
			app.selectPreference();
		});
		if (Html5Feature.runningAsChromePackagedApps()) {
			$('p#allowFileSchemePreference').hide();
		}
	},

	/**
     * Set up page editor event handler
     *
     * @param {Object} app CliWikiApp instance.
     */
	_setUpPageEditorEventHandler: function(app) {
		$('button#editButton').on('click', function() {
			app.startEdit();
		});
		$('button#cancelButton').on('click', function() {
			app.cancelEdit();
		});
		$('button#updateButton').on('click', function() {
			app.commitEdit();
		});
		
		$('details#source summary').on('click', function() {
			$(this).nextAll().toggle();
		});
	}
}
