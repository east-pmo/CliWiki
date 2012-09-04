/**
 * @fileOverview CliWiki user interface class definitions
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.2.2.1(20120904)
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
     * Get allow file scheme element.
     * 
     * @return {Object} Allow file scheme element.
     */
	getAllowFileSchemeElement: function() {
		return $('section#preference input#allowFileScheme');
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
		$('body span[lang][lang!="' + Preference.getLanguage() + '"]').hide();
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
     * hide editor.
     */
	hideEditor: function() {
		$('menu button.edit').hide();
		$('menu button.presentation').show();
		$('#source').hide();
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
		globalMenu.find('li a#preferenceMenuItem').on('click', function() {
			app.selectPreference();
		});
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
