/**
 * @fileOverview CliWiki application entry and class definitions
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012-2013 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.5.1.1(20130925)
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
     * Allow next version function
     * @return {Boolean}
     */
	this._allowNextVersionFunction = false;

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
     * Preview update timer id
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
		if (this._allowNextVersionFunction === false) {
			$('.nextVersion').hide();
		}

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
     * Check available of storage.
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
				'content' : instance.getSourceContent(),
				'markUpStyle': CliWikiUI.getSelectedPageMarkUpStyle()
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
			var newPage = new Page(pageName,
								   this.getSourceTitle(),
								   newContent,
								   new Date().toISO8601String(),
								   CliWikiUI.getSelectedPageMarkUpStyle());
			var updated = true;
			if (this._pageStocker.hasPage(pageName)) {
				var curPage = this._pageStocker.getLatestPageContent(pageName);
				updated = (curPage.title !==  newPage.title
						|| curPage.content !== newPage.content
						|| curPage.markUpStyle !== newPage.markUpStyle);
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
			this._pageStocker.storePage(updatedPage);
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
						 + this.getLastUpdateTime()
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
						 + this.getLastUpdateTime()
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
			var page = new Page(pageName,
								this.title,
								this.content,
								this.lastUpdateTime,
								this.markUpStyle);
			var row = $('<tr></tr>');
			row.append('<td class="pageRevision">' + revision + '</td>');

			var heading = page.getLastUpdateTime() + ' / ' + page.getTitle();
			if (revision === archives.length) {
				row.append('<td><a href="#">' + heading + '</a></td>');
				row.find('a').on('click', function() {
					instance.selectPage(pageName);
				});
			}
			else {
				row.append('<td><details><summary><span>'
							+ heading
							+ '</span></summary><div></div></details></td>');
				row.find('details summary').on('click', function() {
					var content = $(this).nextAll('div');
					if (content.text().length === 0) {
						content.html(instance._format(page.content, page.markUpStyle));
						content.show();
					}
					else {
						content.text('');
						content.hide();
					}
				});
			}
			var operation = $('<td></td>');
			operation.append(instance._makeComparisonElement(pageName, archives.length, revision));
			row.append(operation);
			list.append(row);
			--revision;
		});
	},

	/**
	 * Select difference comparison of page.
	 *
	 * @param {String} pageName Target page name.
	 * @param {Number} targetRevision Target revision to comparison.
	 * @param {Number} selectedRevision Selected revision to comparison.
	 */
	selectDifferenceComparison: function(pageName, targetRevision, selectedRevision) {
		this._selectGlobalSection('pageDifference');

		CliWikiUI.getPageDifferenceTitleElement().text(pageName);

		var comparison = this._getComparisonPage(pageName, targetRevision, selectedRevision);
		var fromPage = comparison.fromPage;
		var toPage = comparison.toPage;

		CliWikiUI.setPageDifferenceHeaderInfo(comparison.fromRev,
											  fromPage,
											  comparison.toRev,
											  toPage);

		var diffSeq = new DiffExtractor().extract(fromPage.content.split('\n'),
												  toPage.content.split('\n'));
		this._buildPageDifferenceSequence(diffSeq);

		var instance = this;
		CliWikiUI.getPageDifferenceViewLatestElement().on('click', function() {
			instance.selectPage(pageName);
		});
		CliWikiUI.getPageDifferenceViewUpdateHistoryElement().on('click', function() {
			instance.selectPageUpdateHistory(pageName);
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

		var style = Preference.getMarkUpStyle();
		var selectStyle = CliWikiUI.getMarkUpStyleElement();
		selectStyle.val(style);
		selectStyle.on('change', function() {
			var changeStyle = selectStyle.children('option:selected').val();
			Preference.setMarkUpStyle(changeStyle);
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
     * Format page data to html.
     *
     * @param {String} pageContent Page content data.
     * @param {String} markUpStyle Mark up style.
     * @return {String} Formatted html.
     */
	_format: function(pageContent, markUpStyle) {
		var formatter = markUpStyle !== undefined && markUpStyle === 'markdown'
						? new MarkdownFormatter()
						: new CliWikiFormatter();
		return formatter.format(pageContent, Preference.getAllowFileScheme());
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
	 * Get page history data to comparison.
	 *
	 * @param {String} pageName Page name.
	 * @param {Number} targetRevision Target revision to comparison.
	 * @param {Number} selectedRevision Selected revision to comparison.
	 * @return {Object} Page history datas to comparison.
	 */
	_getComparisonPage: function(pageName, targetRevision, selectedRevision) {
		var fromRev = targetRevision;
		var toRev = selectedRevision;
		if (toRev < fromRev) {
			fromRev = selectedRevision;
			toRev = targetRevision;
		}
		var fromPage = this._pageStocker.getPageContentOfSpecifiedRevision(pageName, fromRev);
		var toPage = this._pageStocker.getPageContentOfSpecifiedRevision(pageName, toRev);
		return {
			'fromRev': fromRev,
			'fromPage': fromPage,
			'toRev': toRev,
			'toPage': toPage
		};
	},

	/**
	 * Make select element for difference comparison.
	 *
	 * @param {String} pageName Page name.
	 * @param {Number} historyCount Count of page history.
	 * @param {Number} revision Revision of page history.
	 * @return {Object} Select jQuery object for difference comparison.
	 */
	_makeComparisonElement: function(pageName, historyCount, revision) {
		var selector = $('<select></select>');
		for (var index = historyCount; 0 < index; index--) {
			var option = $('<option></option>');
			if (index === revision) {
				var catalogue = new TextCatalogue(Preference.getLanguage());
				option.text(catalogue.getText('Comparison...'));
				option.attr('selected', 'selected');
			}
			else {
				option.text(index);
			}
			selector.append(option);
		}

		var instance = this;
		selector.on('change', function() {
			instance.selectDifferenceComparison(pageName, parseInt(revision), parseInt(selector.find(':selected').text()));
		});
		return selector;
	},

	/**
	 * Make page difference sequence element.
	 *
	 * @param {Object} seq Difference sequence.
	 * @return {Object} Difference element.
	 */
	_makeDiffSeqElement: function(seq) {
		var diffClass;
		if (seq.part === DiffPartType.SHARE) {
			diffClass = 'diffShare';
		}
		else if (seq.part === DiffPartType.FROM) {
			diffClass = 'diffFrom';
		}
		else if (seq.part === DiffPartType.TO) {
			diffClass = 'diffTo';
		}

		var div = $('<div></div>');
		div.addClass(diffClass);
		if (seq.sequences.length === 1 && seq.sequences[0].length === 0) {
			div.addClass('emptyDiffSequence');
		}
		else {
			for (var index = 0; index < seq.sequences.length; index++) {
				if (0 < index) {
					div.append('<br />');
				}
				div.append(seq.sequences[index]);
			}
		}
		return div;
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
	 * Build page difference sequence elements.
	 *
	 * @param {Object} diffSeq Page difference sequence.
     */
	_buildPageDifferenceSequence: function(diffSeq) {
		var tbody = CliWikiUI.getPageDifferenceSequenceElement();
		tbody.empty();
		var index = 0;
		while (index < diffSeq.length) {
			var seq = diffSeq[index];
			var row = $('<tr></tr>');
			var column = $('<td></td>');
			if (seq.part === DiffPartType.SHARE) {
				var diff = this._makeDiffSeqElement(seq);
				if (0 < diff.length) {
					column.attr('colspan', 2);
					column.append(diff);
					row.append(column);
				}
			}
			else if (seq.part === DiffPartType.FROM) {
				var diff = this._makeDiffSeqElement(seq);
				if (0 < diff.length) {
					column.append(diff);
					row.append(column);
					if (index + 1 < diffSeq.length
					&& diffSeq[index + 1].part === DiffPartType.TO) {
						++index;
						diff = this._makeDiffSeqElement(diffSeq[index]);
						if (0 < diff.length) {
							column = $('<td></td>');
							column.append(diff);
							row.append(column);
						}
					}
					else {
						row.append('<td></td>');
					}
				}
			}
			else if (seq.part === DiffPartType.TO) {
				var diff = this._makeDiffSeqElement(seq);
				if (0 < diff.length) {
					row.append('<td></td>');
					column.append(diff);
					row.append(column);
				}
			}
			if (0 < row.length) {
				tbody.append(row);
			}
			++index;
		}
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
		content.html(this._format(page.content, page.markUpStyle));

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

		var pageMarkUpStyle = Preference.getMarkUpStyle();
		if (page.markUpStyle !== undefined && page.markUpStyle !== null) {
			pageMarkUpStyle = page.markUpStyle;
		}
		CliWikiUI.getPageMarkUpStyleElement().val(pageMarkUpStyle);
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
