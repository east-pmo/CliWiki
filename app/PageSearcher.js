/**
 * @fileOverview CliWiki page search class definitions
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012, EAST Co.,Ltd.
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
 * PageSearcher
 * 
 * @class Page searcher
 */
function PageSearcher(stocker) {
    /**
     * Page stocker
     * @return {WikiPageStocker}
     */
	this._stocker = stocker
}
PageSearcher.prototype = {
	//
	// Public function
	//

	/**
	 * Split search keyword string to array.
	 *
	 * @param {String} keyword Search Keyword string.
	 * @return {Array> Splitted search keyword.
  	 */
	splitKeyword: function(keyword) {
		var keywords = new Array();

		var src = keyword.trim();
		var first = 0;
		while (0 <= (first = src.indexOf('"'))) {
			var last = src.indexOf('"', first + 1);
			if (last < first) {
				break;
			}
			this._addWordTo(src.substring(0, first), keywords);
			keywords.push(src.substring(first + 1, last));
			src = src.substr(last + 1);
		}
		this._addWordTo(src, keywords);
		return keywords;
	},

    /**
     * Search by keyword
     *
     * @param {Array} keywords Search keywords.
     * @return {Object} Hit result.
     */
	search: function(keywords) {
		var pages = this._stocker.getPageNameList();
		var hitPageInfo = new Array();
		for (var index = 0; index < pages.length; index++) {
			var hitContent = null;

			var page = this._stocker.getLatestPageContent(pages[index]);
			var content = page.content.split('\n');
			var hitInfo = null;
			for (var i = 0; i < keywords.length; i++) {
				var keyword = keywords[i];

				if (0 <= pages[index].indexOf(keyword)
				|| 0 <= page.title.indexOf(keyword)) {
					hitInfo = {
						'name' : pages[index],
						'title' : page.title,
						'content' : null
					};
				}

				for (var line = 0; line < content.length; line++) {
					if (0 <= content[line].indexOf(keyword)) {
						if (hitInfo === null) {
							hitInfo = {
								'name' : pages[index],
								'title' : page.title,
								'content' : null
							};
						}
						hitInfo.content = content[line];
						break;
					}
				}

				if (hitInfo !== null) {
					hitPageInfo.push(hitInfo);
					break;
				}
			}
		}
		return hitPageInfo;
	},

	//
	// Private function
	//

    /**
     * Add search keyword to array.
     *
     * @param {String} keyword Search keyword
     * @param {Array} keywords Array to add result.
     */
	_addWordTo: function(keyword, keywords) {
		var src = keyword.split(' ');
		for (var index = 0; index < src.length; index++) {
			var word = src[index].trim();
			if (0 < word.length) {
				keywords.push(word);
			}
		}
	}
}
