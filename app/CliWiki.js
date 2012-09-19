/**
 * @fileOverview CliWiki application entry and class definitions
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
// Class definitions
//

/** 
 * CliWikiApp
 * 
 * @class CliWiki application
 */
function CliWikiApp() {
    /**
     * Page stocker
     * @return {WikiPageStocker}
     */
	this._pageStocker = new WikiPageStocker(Preference.getMaxHistory());

    /**
     * Current page name
     * @return {String}
     */
	this._currentPageName = null;

    /**
     * Preview update timeer id
     * @return {Number}
     */
	this._previewUpdateTimerId = null;
}
CliWikiApp.prototype = {
	//
	// Public method
	//

    /**
     * Initialize application.
     */
	init: function() {
		CliWikiFooterUI.getAppVersionElement().text(Preference.getAppVersion());
		CliWikiUI.changeDisplayLanguage();
		CliWikiUI.hideEditor();

		this._currentPageName = this._pageStocker.getFrontPageName();
		this._updateContentList();

		CliWikiUI.selectSection('page');

		var page = this._getCurrentPageLatestContent();
		this._setSource(page);
		this._setPresentation(page, false);
	},

    /**
     * Set up user interface ievent handler.
     */
	setUpEventHandler: function() {
		CliWikiUI.setUpEventHandler(this);
	},

    /**
     * Check available of strage.
     *
     * @return {Boolean} True if available.
     */
	isStorageAvailable: function() {
		return this._pageStocker.isStorageAvailable();
	},

    /**
     * Get current page name.
     *
     * @return {String} Current page name.
     */
	getCurrentPageName: function() {
		return this._currentPageName;
	},

    /**
     * Get source title.
     *
     * @return {String} Source title.
     */
	getSourceTitle: function() {
		return CliWikiUI.getSourceTitleElement().val();
	},

    /**
     * Get source content.
     *
     * @return {String} Source content.
     */
	getSourceContent: function() {
		return CliWikiUI.getSourceContentElement().val();
	},

    /**
     * Start page edit.
     */
  	startEdit: function() {
		CliWikiUI.showEditor();
		this._stopPreviewUpdate();

		var instance = this;
		this._previewUpdateTimerId = setInterval(function() {
			var previewPage = {
				'name' : instance.getCurrentPageName(),
				'title' : instance.getSourceTitle(),
				'content' : instance.getSourceContent()
			};
			instance.setPreviewPresentation(previewPage);
		}, Preference.getPreviewUpdateIntervalMs());
	},

    /**
     * Cancel page edit.
     */
	cancelEdit: function() {
		var isUpdate = this._pageStocker.hasPage(this._currentPageName);
		var pageName = isUpdate
					? this._currentPageName
					: this._pageStocker.getFrontPageName();
		var page = this._pageStocker.getLatestPageContent(pageName);
		page.name = pageName;

		this._setSource(page);
		this._setPresentation(page, false);

		if (isUpdate === false) {
			this._updateContentList();
		}

		CliWikiUI.hideEditor();
		this._stopPreviewUpdate();
	},

    /**
     * Commit result of edit page.
     */
	commitEdit: function() {
		var pageName = this.getCurrentPageName();
		var newContent = this.getSourceContent();
		if (0 < newContent.length) {
			var newPage = {
				'name' : pageName,
				'title': this.getSourceTitle(),
				'content' : newContent,
				'lastUpdateTime' : new Date().toISO8601String()
			};

			var updated = true;
			if (this._pageStocker.hasPage(pageName)) {
				var curPage = this._pageStocker.getLatestPageContent(pageName);
				updated = (curPage.title !==  newPage.title
						|| curPage.content !== newPage.content);
			}

			if (updated) {
				this.setPage(newPage);
			}
		}
		else {
			if (this._pageStocker.hasPage(pageName) === false) {
				return;
			}
			if (pageName === this._pageStocker.getFrontPageName()) {
				CliWikiUI.alert('FrontPage can\'t delete.');
				return;
			}

			var catalogue = new TextCatalogue(Preference.getLanguage());
			if (CliWikiUI.confirm(pageName
								  + catalogue.getText(': Do you want to delete this page?')) === false) {
				return;
			}

			this._pageStocker.deletePage(pageName);
			var page = this._pageStocker.getLatestPageContent(this._pageStocker.getFrontPageName());
			page.name = this._pageStocker.getFrontPageName();
			this.setPage(page);
		}

		this._updateContentList();
		CliWikiUI.hideEditor();
		this._stopPreviewUpdate();
	},

    /**
     * Set page to show.
     *
     * @param {Object} page Set page data.
     */
	setPage: function(page) {
		var updatedPage = page;
		if (updatedPage !== undefined && updatedPage !== null) {
			this._currentPageName = updatedPage.name;
			this._pageStocker.storePage(updatedPage.name, updatedPage.title, updatedPage.content);
		}
		else {
			updatedPage = this._getCurrentPageLatestContent();
		}
		this._setSource(updatedPage);
		this._setPresentation(updatedPage, false);
	},

    /**
     * Set preview presentation.
     *
     * @param {Object} page Set page data.
     */
	setPreviewPresentation: function(page) {
		this._setPresentation(page, true);
	},

	/**
     * Select page.
     *
     * @param {String} pageName Page name to show.
     */
	selectPage: function(pageName) {
		CliWikiUI.selectSection('page');
		this._currentPageName = pageName;
		this._updateContentList();

		CliWikiUI.hideEditor();
		var page = this._getCurrentPageLatestContent();
		this._setSource(page);
		this._setPresentation(page, false);
	},

    /**
     * Select page list.
     */
	selectPageList: function() {
		this._selectGlobalSection('pageList');

		var instance = this;

		var tbody = CliWikiUI.getPageListTableBodyElement();
		tbody.empty();
		jQuery.each(this._pageStocker.getPageInfoList(false), function() {
			var updateCount = this.getUpdateCount();
			var row = $('<tr><td>'
						 + instance._makePageLinkElementString(this.name, this.title)
						 + '</td><td class="lastUpdateTime">'
						 + (this.lastUpdateTime !== null ? this.lastUpdateTime : '-')
						 +'</td>'
						 + instance._makePageUpdateCountCell(updateCount)
						 + '</tr>');
			if (0 < updateCount) {
				instance._setPageUpdateHistoryEvent(row.find('td.updateCount a'), this.name);
			}
			tbody.append(row);
		});
		tbody.find('a[href!=""][class!="pageUpdateHistory"]').each(function() {
			instance._setPageAnchorClickEvent($(this));
		});
	},

    /**
     * Select update history.
     */
	selectUpdateHistory: function() {
		this._selectGlobalSection('updateHistory');

		var instance = this;

		var tbody = CliWikiUI.getUpdateHistoryTableBodyElement();
		tbody.empty();
		jQuery.each(this._pageStocker.getPageInfoList(true), function() {
			var updateCount = this.getUpdateCount();
			var row = $('<tr><td class="lastUpdateTime">'
						 + (this.lastUpdateTime !== null ? this.lastUpdateTime : '-')
						 +  '</td><td>'
						 + instance._makePageLinkElementString(this.name, this.title)
						 + '</td>'
						 + instance._makePageUpdateCountCell(updateCount)
						 + '</tr>');
			if (0 < updateCount) {
				instance._setPageUpdateHistoryEvent(row.find('td.updateCount a'), this.name);
			}
			tbody.append(row);
		});

		tbody.find('a[href!=""][class!="pageUpdateHistory"]').each(function() {
			instance._setPageAnchorClickEvent($(this));
		});
	},

    /**
     * Select page update history.
     *
     * @param {String} pageName Page name to show update history.
     */
	selectPageUpdateHistory: function(pageName) {
		this._selectGlobalSection('pageUpdateHistory');

		CliWikiUI.getPageUpdateHistoryTitleElement().text(pageName);
		var list = CliWikiUI.getPageUpdateHistoryListElement();
		list.empty();
		var archives = this._pageStocker.getPageContentArchives(pageName);
		var revision = archives.length;
		var instance = this;
		jQuery.each(archives, function() {
			var page = new Page(this.name, this.title, this.content, this.lastUpdateTime);
			var row = $('<tr></tr>');
			row.append('<td class="pageRevision">' + revision + '</td>');
			row.append('<td><details><summary><span>'
						+ (page.lastUpdateTime !== null ? page.lastUpdateTime : '-')
					    + ' / '
					    + page.getTitle()
						+ '</span></summary><div></div></details></td>');
			row.find('details summary').on('click', function() {
				var content = $(this).nextAll('div');
				content.html(content.text().length === 0
							? instance._format(page.content)
							: '');
			});
			list.append(row);
			--revision;
		});
	},

    /**
     * Select preference.
     */
	selectPreference: function() {
		this._selectGlobalSection('preference');

		var allowFileScheme = CliWikiUI.getAllowFileSchemeElement();
		if (Preference.getAllowFileScheme()) {
			allowFileScheme.attr('checked', 'checked');
		}
		else {
			allowFileScheme.removeAttr('checked');
		}
		allowFileScheme.on('click', function() {
			Preference.setAllowFileScheme(allowFileScheme.attr('checked') === 'checked');
		});

		var lang = Preference.getLanguage();
		var dispLang = CliWikiUI.getDisplayLanguageElement();
		dispLang.val(lang);
		dispLang.on('change', function() {
			var changeLang = dispLang.children('option:selected').val();
			Preference.setLanguage(changeLang);
			CliWikiUI.changeDisplayLanguage();
		});
	},

    /**
     * Change current page.
     *
     * @param {String} pageName Page name to show.
     */
	changePage: function(pageName) {
		if (this._pageStocker.hasPage(pageName)) {
			this.selectPage(pageName);
		}
		else {
			this._currentPageName = pageName;
			var newPage = {
				'name' : pageName,
				'title' : pageName,
				'content' : '',
				'lastUpdateTime': null
			};
			this._setSource(newPage);
			this._setPresentation(newPage, false);
			CliWikiUI.selectSection('page');
			this.startEdit();
		}
	},

    /**
     * Search pages.
     *
     * @param {String} keyword Search keyword.
     */
	search: function(keyword) {
		CliWikiUI.getSearchResultTitleElement().text(keyword);
		CliWikiUI.prepareSearch();
		this._selectGlobalSection('searchResult');

		var searcher = new PageSearcher(this._pageStocker);
		var words = searcher.splitKeyword(keyword);
		var hitPageInfo = searcher.search(words);

		CliWikiUI.setSearchResult(this._pageStocker.getPageNameList().length, hitPageInfo.length);

		var instance = this;
		var tbody = CliWikiUI.getSearchResultListElement();
		tbody.empty();
		jQuery.each(hitPageInfo, function() {
			var row = $('<tr></tr>');
			var title = instance._emphasizeText(this.title, words);
			var result = '<td>' + instance._makePageLinkElementString(this.name, title);
			if (this.content !== null) {
				result += '<br />' + instance._emphasizeText(this.content, words);
			}
			result += '</td>';

			row.append(result);
			tbody.append(row);
		});

		tbody.find('a[href!=""]').each(function() {
			instance._setPageAnchorClickEvent($(this));
		});
	},

	//
	// Pirvate method
	//

    /**
     * Get formatter instance.
     *
     * @return {Object} Formatter instance.
     */
	_getFormatter: function() {
		return new CliWikiFormatter();
	},

    /**
     * Format page data to html.
     *
     * @param {String} pageContent Page content data.
     * @return {String} Formatted html.
     */
	_format: function(pageContent) {
		return this._getFormatter().format(pageContent, Preference.getAllowFileScheme());
	},

    /**
     * Get latest content of current page
     *
     * @return {Object} Page data.
     */
	_getCurrentPageLatestContent: function() {
		var page = this._pageStocker.getLatestPageContent(this._currentPageName);
		page.name = this._currentPageName;
		return page;
	},

	/**
     * Make page link element string.
     *
     * @param {String} name Page name.
     * @param {String} title Page title.
     * @return {String} Link element string.
     */
	_makePageLinkElementString: function(pageName, pageTitle) {
		return '<a href="#" title="' + pageName + '">'
				+ pageTitle
				+ '(' + pageName  + ')</a>';
	},

	/**
     * Make side bar content list item.
     *
     * @param {String} name Page name.
     * @param {String} title Page title.
     * @return {Object} List item jQuery object.
     */
	_makeContentListItem: function(name, title) {
		var item = $('<li><a>' + title + '</a></li>');
		var anchor = item.find('a');
		anchor.attr('title', name);
		if (name !== this._currentPageName) {
			anchor.attr('href', '#');
		}
		this._setPageAnchorClickEvent(anchor);

		return item;
	},

    /**
     * Make page update count cell html fragment
     *
     * @param {Number} updateCount Page update count
     * @return {String} Page update count cell html fragment
     */
	_makePageUpdateCountCell: function(updateCount) {
		return '<td class="updateCount">'
				+ (0 < updateCount
				   ? '<a href="#" class="pageUpdateHistory">' + updateCount + '</a>'
				   : '-')
				+ '</td>';
	},

    /**
	 * Emphasize text.
	 *
	 * @param {String} text Text emphasize to.
	 * @param {Array} words Emphasize target words.
	 * @return {String} Emphasized text.
     */
	_emphasizeText: function(text, words) {
		var emphasized = text;
		for (var index = 0; index < words.length; index++) {
			var re = new RegExp(words[index].escapeRegExpMetaChar(), 'g');
			emphasized = emphasized.replace(re, '<strong>' + words[index] + '</strong>');
		}
		return emphasized;
	},

    /**
	 * Select global section
	 *
	 * @param {String} sectionId Section element Id.
     */
	_selectGlobalSection: function(sectionId) {
		CliWikiUI.selectSection(sectionId);
		this._currentPageName = '';
		this._updateContentList();
	},

    /**
     * Set page update history event
     *
     * @param {Object} anchor Anchor jQuery objectPge to set event.
     * @param {String} pageName Page name to show update history.
     */
	_setPageUpdateHistoryEvent: function(anchor, pageName) {
		var instance = this;
		anchor.on('click', function() {
			instance.selectPageUpdateHistory(pageName);
		});
	},

    /**
     * Stop preview update.
     */
	_stopPreviewUpdate: function() {
		if (this._previewUpdateTimerId !== null) {
			clearInterval(this._previewUpdateTimerId);
			this._previewUpdateTimerId = null;
		}
	},

    /**
     * Set page anchor click event
     *
     * @param {Object} anchor Target anchor jQuery object.
     */
	_setPageAnchorClickEvent: function(anchor) {
		var instance = this;
		anchor.on('click', function() {
			if (anchor.attr('href') !== undefined) {
				instance.selectPage(anchor.attr('title'));
			}
		});
	},

    /**
     * Set page list
     *
     * @param {Array} pages Page list.
     * @param {Object} listElement Target element jQuery object.
     */
	_setPageList: function(pages, listElement) {
		listElement.empty();

		var instance = this;
		jQuery.each(pages, function() {
			var pageName = this.toString();
			var page = instance._pageStocker.getLatestPageContent(pageName);
			listElement.append(instance._makeContentListItem(pageName, page.title));
		});
	},

    /**
     * Update content list
     */
	_updateContentList: function() {
		this._setPageList(this._pageStocker.getPageNameList(),
						  CliWikiUI.getContentListElement());

		var dates = new Array();
		var infosByDate = new Array();
		jQuery.each(this._pageStocker.getPageInfoList(true), function() {
			if (this.lastUpdateTime !== null) {
				var date = this.lastUpdateTime.substring(0, this.lastUpdateTime.indexOf('T'));
				if (dates.length === 0 || dates[dates.length - 1] !== date) {
					dates.push(date);
				}
				if (infosByDate[date] === undefined || infosByDate[date] === null) {
					infosByDate[date] = new Array();
				}
				infosByDate[date].push(this);
			}
		});

		var instance = this;
		var recentUpdate = CliWikiUI.getRecentUpdateContentElement();
		recentUpdate.empty();
		jQuery.each(dates, function() {
			var list = $('<ul></ul>');
			jQuery.each(infosByDate[this], function() {
				list.append(instance._makeContentListItem(this.name, this.title));
			});
			recentUpdate.append('<h2>' + this + '</h2>').append(list);
		});
	},

    /**
     * Set presentation data
     *
     * @param {Object} page Page data.
     * @param {Boolean} asPreview Set as preview.
     */
	_setPresentation: function(page, asPreview) {
		CliWikiUI.getPresentationTitleElement().text(page.title !== undefined && 0 < page.title.length ? page.title : page.name);

		var content = CliWikiUI.getPresentationContentElement();
		content.html(this._format(page.content));

		if (asPreview === false) {
			var instance = this;
			content.find('a[class="wikiPage"]').each(function() {
				var anchor = $(this);
				var pageName = anchor.attr('title').toString();
				if (instance._pageStocker.hasPage(pageName) === false) {
					anchor.before(anchor.text());
					anchor.text('?');
				}
				anchor.on('click', function() {
					instance.changePage(anchor.attr('title').toString());
				});
			});

			var lastUpdateElement = CliWikiUI.getContentLastUpdateTimeElement();
			if (page.lastUpdateTime !== null) {
				lastUpdateElement.text(page.lastUpdateTime);
				lastUpdateElement.attr('datetime', page.lastUpdateTime)
			}
			else {
				lastUpdateElement.text('-');
				lastUpdateElement.removeAttr('datetime');
			}
		}
	},

    /**
     * Set source data
     *
     * @param {Object} page Page data.
     */
	_setSource: function(page) {
		CliWikiUI.getSourcePageNameElement().text(page.name);
		CliWikiUI.getSourceTitleElement().val(page.title !== undefined && 0 < page.title.length ? page.title : page.name);
		CliWikiUI.getSourceContentElement().val(page.content);
	},

    /**
     * Select current page in list.
     *
     * @param {String} pageName Page name to show.
     * @param {Object} listElement Target list element jQuery object.
     */
	_selectCurrentPageInList: function(pageName, listElement) {
		listElement.find(':not(a[href])').attr('href', '#').removeClass('currentPage');
		listElement.find('a[title="' + pageName + '"]').removeAttr('href').attr('class', 'currentPage');
	}
}

//
// Entry
//

$(function() {
	var app = new CliWikiApp();
	app.init();
	app.setUpEventHandler();

	if (app.isStorageAvailable() === false) {
		CliWikiUI.alert('申し訳ありません、ご利用の環境はページの保存に対応しておりません。ページを閉じると編集内容は失われます。');
		$('header#pageHeader h1').text($('header#pageHeader h1').text() + '(Trial)');
	}
	else {
		var initMatch = '?init=localstorage';
		var pos = window.location.href.indexOf(initMatch);
		if (pos === (window.location.href.length - initMatch.length)) {
			if (CliWikiUI.confirm('Do you want to initialize the local storage?')) {
				localStorage.clear();
			}
			window.location.replace(window.location.href.substring(0, pos));
		}
	}
});
