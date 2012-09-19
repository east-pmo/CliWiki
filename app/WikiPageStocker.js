/**
 * @fileOverview WikiText formatter class definitions
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
// Class definition
//

/** 
 * LocalStorageAdapter
 * 
 * @class Storage adapter to use local storage of web storage
 * @param {Number} maxHistory Max count of history
 */
function LocalStorageAdapter(maxHistory) {
    /**
     * Max count of history
     * @return {Number}
     */
	this._maxHistory = maxHistory;
}
LocalStorageAdapter.prototype = {
	//
	// Public function
	//

	/** 
	 * Check available of local storage.
	 * 
	 * @return {Boolean} Result
	 */
	isAvailable: function() {
		return Html5Feature.isLocalStorageAvailable();
	},

	/** 
	 * Check initialized.
	 * 
	 * @return {Boolean} Result
	 */
	isInitialized: function() {
		return localStorage.getItem('CliWiki_PageNameList') !== null;
	},

	/** 
	 * Get page name list
	 * 
	 * @return {Array} Array of page name.
	 */
	getPageNameList: function() {
		var names = localStorage.getItem('CliWiki_PageNameList');
		return names !== null ? JSON.parse(names) : new Array();
	},

	/** 
	 * Check exists page.
	 * 
	 * @param {String} pageName Page name to check.
	 * @return {Boolean} Results
	 */
	hasPage: function(pageName) {
		var has = false;
		var names = this.getPageNameList();
		for (var index = 0; index < names.length && has === false; index++) {
			has = (names[index] === pageName);
		}
		return has;
	},

	/** 
	 * Get content archives of specified page
	 *
	 * @param {String} pageName Target page name.
	 * @return {Array} Content archivesof specified page.
	 */
	getPageContentArchives: function(pageName) {
		var pageHistory = localStorage.getItem(this._makePageKey(pageName));
		if (pageHistory === null) {
			throw new Error();
		}
		return JSON.parse(pageHistory);
	},

	/** 
	 * Get content history of specified page
	 *
	 * @param {String} pageName Target page name.
	 * @return {Boolean} Content historyof specified page.
	 */
	getPageContentHistory: function(pageName) {
		var pageHistory = localStorage.getItem(this._makePageKey(pageName));
		if (pageHistory === null) {
			throw new Error();
		}

		var pages = JSON.parse(pageHistory);
		var updateTimes = new Array();
		for (var index = 0; index < pages.length; index++) {
			updateTimes[index] = pages[index].lastUpdateTime;
		}
		return updateTimes;
	},

	/** 
	 * Store page
	 *
	 * @param {String} pageName Target page name.
	 * @param {String} title Title of content.
	 * @param {String} content Content.
	 * @param {String} asInitialize Store as initialize.
	 */
	storePage: function(pageName, title, content, asInitialize) {
		var newPage = {
			'title' : title,
			'content' : content,
			'lastUpdateTime': asInitialize ? null : new Date().toISO8601String()
		};
		var pageKey = this._makePageKey(pageName);
		if (this.hasPage(pageName) === false) {
			// Add
			var pageHistory = [
				newPage
			];
			localStorage.setItem(pageKey, JSON.stringify(pageHistory));

			var names = this.getPageNameList();
			names[names.length] = pageName;
			this._setPageNameList(names);
		}
		else {
			// Update
			var pages = JSON.parse(localStorage.getItem(pageKey));
			pages.unshift(newPage);
			if (this._maxHistory <= pages.length) {
				pages.pop();
			}
			localStorage.setItem(pageKey, JSON.stringify(pages));
		}
	},

	/** 
	 * Delete page
	 *
	 * @param {String} pageName Target page name.
	 */
	deletePage: function(pageName) {
		var pageKey = this._makePageKey(pageName);
		if (localStorage.getItem(pageKey) === null) {
			throw new Error();
		}

		localStorage.removeItem(pageKey);

		var names = this.getPageNameList();
		for (var index = 0; index < names.length; index++) {
			if (names[index] === pageName) {
				names.splice(index, 1);
				break;
			}
		}
		this._setPageNameList(names);
	},

	//
	// Private function
	//

	/** 
	 * Make page key string
	 *
	 * @param {String} pageName Target page name.
	 * @result {String} Page key string.
	 */
	_makePageKey: function(pageName) {
		return 'CliWiki_Page_' + pageName;
	},

	/** 
	 * Store page name list.
	 *
	 * @param {String} pageName Target page name.
	 */
	_setPageNameList: function(pageNames) {
		localStorage.setItem('CliWiki_PageNameList', JSON.stringify(pageNames));
	}
}

/** 
 * Page
 * 
 * @class Page data
 */
function Page(name, title, content, lastUpdateTime) {
    /**
     * Page name
     * @return {String}
     */
	this.name = name;

    /**
     * Page title
     * @return {String}
     */
	this.title = title;

    /**
     * Content
     * @return {String}
     */
	this.content = content;

    /**
     * Last update time
     * @return {Date}
     */
	this.lastUpdateTime = lastUpdateTime;
}
Page.prototype = {
	//
	// Public function
	//

	/** 
	 * Get page title.
	 * 
	 * @return {String} Page title.
	 */
	getTitle: function() {
		return this.title !== undefined && 0 < this.title.length
			? this.title
			: this.name;
	}
}

/** 
 * PageInfo
 * 
 * @class Page information
 * @param {String} name Page name
 * @param {String} title Page title
 * @param {Date} lastUpdateTime Last update time
 * @param {Number} updateCount Update count
 */
function PageInfo(name, title, lastUpdateTime, updateCount) {
    /**
     * Page name
     * @return {String}
     */
	this.name = name;

    /**
     * Page title
     * @return {String}
     */
	this.title = title;

    /**
     * Last update time
     * @return {Date}
     */
	this.lastUpdateTime = lastUpdateTime;

    /**
     * Update count
     * @return {Number}
     */
	this._updateCount = updateCount;
}
PageInfo.prototype = {
	//
	// Public function
	//

	/** 
	 * Get update count.
	 * 
	 * @return {Number} Update count
	 */
	getUpdateCount: function() {
		return this._updateCount - 1;
	}
}

/** 
 * WikiPageStocker
 * 
 * @class Wiki page stocker
 * @param {Number} maxHistory Max count of history
 */
function WikiPageStocker(maxHistory) {
    /**
     * Storage instance
     * @return {StorageAdapter}
     */
	this._storage = new LocalStorageAdapter(maxHistory);

	this._initDefault();
}
WikiPageStocker.prototype = {
	//
	// Public function
	//

	/** 
	 * Check available of storage.
	 * 
	 * @return {Boolean} Result
	 */
	isStorageAvailable: function() {
		return this._storage.isAvailable()
	},

	/** 
	 * Get page name list
	 * 
	 * @return {Array} Array of page name.
	 */
	getPageNameList: function() {
		return this.isStorageAvailable()
				? this._storage.getPageNameList()
				: this._pageList;
	},

	/** 
	 * Get page info list
	 *
	 * @param {Boolean} sortByTime Sort by last update time.
	 * @return {Array} Array of page name.
	 */
	getPageInfoList: function(sortByTime) {
		var infos = new Array();
		var names = this.getPageNameList();
		for (var index = 0; index < names.length; index++) {
			var pageArchives = this.getPageContentArchives(names[index]);
			var page = pageArchives[0];
			if (page !== undefined) {
				infos.push(new PageInfo(names[index], page.title,
										page.lastUpdateTime, pageArchives.length));
			}
		}
		return sortByTime !== false ? this._sortPageInfoList(infos) : infos;
	},

	/** 
	 * Get front page name
	 * 
	 * @return {String} Front page name
	 */
	getFrontPageName: function() {
		return this.getPageNameList()[0];
	},

	/** 
	 * Check exists page.
	 *
	 * @param {String} pageName Page name to check.
	 * @return {Boolean} Results
	 */
	hasPage: function(pageName) {
		var has = (this.isStorageAvailable() && this._storage.hasPage(pageName));
		for (var index = 0; index < this._pageList.length && has === false; index++) {
			has = (this._pageList[index] === pageName);
		}
		return has;
	},

	/** 
	 * Get latest content of specified page
	 *
	 * @param {String} pageName Target page name.
	 * @return {Object} Latest content of specified page.
	 */
	getLatestPageContent: function(pageName) {
		var pageContent = null;
		if (this.isStorageAvailable() && this._storage.hasPage(pageName)) {
			pageContent = this._storage.getPageContentArchives(pageName)[0];
		}
		else {
			// TODO 実装
			pageContent = this._pages[pageName];
		}
		if (pageContent.title === undefined || pageContent.title.length === 0) {
			pageContent.title = pageName;
		}
		return pageContent;
	},

	/** 
	 * Get content archives of specified page
	 *
	 * @param {String} pageName Target page name.
	 * @return {Object} Content archives of specified page.
	 */
	getPageContentArchives: function(pageName) {
		var pageArchives = null;
		if (this.isStorageAvailable() && this._storage.hasPage(pageName)) {
			pageArchives = this._storage.getPageContentArchives(pageName);
		}
		else {
			// TODO 実装
			pageArchives = this._pages[pageName];
		}
		return pageArchives;
	},

	/** 
	 * Store page
	 *
	 * @param {String} pageName Target page name.
	 * @param {String} title Title of content.
	 * @param {String} content Content.
	 */
	storePage: function(pageName, title, content) {
		if (this.isStorageAvailable()) {
			this._storage.storePage(pageName, title, content, false);
		}
		else {
			this._pages[pageName] = page;
			if (this.hasPage(pageName) === false) {
				this._pageList[this._pageList.length] = pageName;
			}
		}
	},

	/** 
	 * Delete page
	 *
	 * @param {String} pageName Target page name.
	 */
	deletePage: function(pageName) {
		if (this.isStorageAvailable()) {
			this._storage.deletePage(pageName);
		}
		else {
			delete this._pages[pageName];
			for (var index = 0; index < this._pageList.length; index++) {
				if (this._pageList[index] === pageName) {
					this._pageList.splice(index, 1);
					break;
				}
			}
		}
	},

	//
	// Private function
	//

	/** 
	 * Sort page info list by last update time descendant.
	 * 
	 * @param {Array} info Target page info list.
	 * @return {Array} Sorted page info.
	 */
	_sortPageInfoList: function(infos) {
		infos.sort(function(lhs, rhs) {
			var result = 0;
			if (lhs.lastUpdateTime === null) {
				if (rhs.lastUpdateTime !== null) {
					result = 1;
				}
			}
			else if (rhs.lastUpdateTime === null) {
				if (lhs.lastUpdateTime !== null) {
					result =  -1;
				}
			}
			else {
				if (lhs.lastUpdateTime < rhs.lastUpdateTime) {
					result = 1;
				}
				else if (rhs.lastUpdateTime < lhs.lastUpdateTime) {
					result = -1;
				}
			}
			return result;
		});
		return infos;
	},

	/** 
	 * Get initialize front page content data.
	 *
	 * @param {String} lang Language.
	 */
	_getInitFrontPageContent: function(lang) {
		var content;
		switch (lang) {
			case 'ja':
				content = 'CliWikiへようこそ。\n\nCliWiki(\'\'\'Cli\'\'\'ent \'\'\'Wiki\'\'\')はWikiを実現するHTML5アプリケーションです。ブラウザ単独で動作し、データをローカルに保存するため、インターネット接続を必要しません。サーバーやデータベースを用意することなく、またセットアップすることもなく、すぐに個人用Wikiとしてメモ帳代わりに利用することができます。会議の議事録メモや、ネット公開したくない日記などに最適です。\n\nまずは SandBox で編集を試してみてください。 \n\nhttp://www.w3.org/html/logo/downloads/HTML5_Logo_128.png\n\n\n技術的なお問い合わせやご意見・ご感想は[[Facebookのhtml5eastグループ|http://www.facebook.com/groups/HTML5east/]]でお聞かせいただければ幸いです。';
				break;
			default:
				content = 'Welcome to [[CliWiki|https://chrome.google.com/webstore/detail/gegmobbadcnkafkpogenlobdjgiafppe]].\n\nCliWiki(\'\'\'Cli\'\'\'ent \'\'\'Wiki\'\'\') is a HTML5 application that acts as a Wiki. It works only a browser and store data to local storage. It should be no Internet connection. This is ideal for notes of meetings, diary, etc. that you do not want to expose to the Internet.\n\nFirst, please try editing in a sandbox.\n\nhttp://www.w3.org/html/logo/downloads/HTML5_Logo_128.png\n\nIf you have technical inquiries, opinions and impressions, please post comment to [[html5 east group in Facebook|http://www.facebook.com/groups/HTML5east/]].\n';
				break;
		}
		return content;
	},

	/** 
	 * Initialize default data.
	 */
	_initDefault: function() {
		this._pageList = [
			'FrontPage',
			'SandBox'
		];

		var lang = Preference.getLanguage();
		this._pages = new Object();
	 	this._pages['FrontPage'] = {
			'title' : 'FrontPage',
			'content' : this._getInitFrontPageContent(lang),
			'lastUpdateTime' : null
		};
	 	this._pages['SandBox'] = {
			'title' : 'SandBox',
			'content' : '「編集」ボタンを選択して編集してみてください。\n\n書式は「ヘルプ」の「書式」で確認できます。実際の出力はテキスト入力エディターの下で確認できます。\n「編集」を選択してソースのテキストと見比べてみてください。\n\n! 段落書式\n\n!! 見出し\n\n\'!\'ではじまる行は見出しになります。\'!\'の数でレベルを指定します。\n\n!! 水平線\n\n\'----\'だけを記述すると次のような水平線になります。\n\n----\n\n!! リスト\n\n\'*\'ではじまる連続した行は順序なしのリストになります。\n\n* 項目1\n** 項目1の1\n** 項目1の2\n* 項目2\n* 項目3\n\n\'#\'ではじまる連続した行は順序ありのリストになります。\n\n# 項目1\n# 項目2\n## 項目2の1\n## 項目2の2\n# 項目3\n\n!! 用語解説\n\n\':\'ではじまり、\':\'を挟んで用語と解説を記述した連続行は用語解説になります。\n\n:用語の見出し1:用語1の解説\n:用語の見出し2:用語2の解説\n:用語の見出し3:用語4の解説\n\n\n!! 整形済みテキスト\n\n空白(U+0020)またはタブではじまる行は整形済みテキストとみなします。\n\n 整形済みテキストは\n 改行がそのままのかたちで残ります。\n\n\'<<<\'だけを記述した行から\'>>>\'だけを記述した行のあいだも整形済みテキストとみなします。\n\n!! 表\n\n\'||\'ではじまる行は表のかたちに整形します。\'||\'がセルの区切りになります。行末尾には\'||\'はいりません。\n\nセルの項目の頭に「!」をつけると見出しセルになります。行の連結には「^」を、列の連結には「>」を、連結したい数だけセルの項目頭につけてください。\n\n!!! 記述例\n\n||!行 / 列見出し||!A||!B||!C||!>D-E\n||!1||A1||B1||^C1-C2||D1||E1\n||!2||A2||B2||^>D2-E2-D3-E3\n||!3||A3||B3||C3\n\n!! コメント\n\n\'//\'ではじまる行はコメントとして取りあつかい出力しません。\n\n!! 上記以外\n\n上記以外は普通の段落になります。\n\n空行を指定すると段落が変わります。\n連続した行はひとつの段落とみなします。この部分のソースを見てみてください。\n\n! テキスト書式\n\n!! Wiki Name\n\n次の条件に該当する単語はWikiNameになります。\n\n# 前後が空白または改行で区切られている。\n# 大文字の英字で始まり、小文字の英字または数字が続く。\n# 2.が二回以上繰りかえされる。\n\nWikiNameには該当ページへのリンクを自動的に設定します。存在しないページ名のWikiNameを記述して選択すると新規ページ作成を行います。たとえば次のWikiNameを選択すると\'NewPage\'というページ名の新規ページを作成します。\n\nNewPage\n\n!! 画像とWeb URL自動リンク\n\n次の条件に該当するURLはリンクまたは画像として処理します。\n\n# 前後が空白または改行で区切られている。\n# \'http://\'または\'https://\'ではじまる。\n\n画像の場合は指定URLの画像を表示します。それ以外はリンクを設定します。\n\n!!! 画像の例\n\nhttp://www.w3.org/html/logo/downloads/HTML5_Logo_128.png\n\n!!! リンクの例\n\nhttp://www.w3.org/html/planet/\n\n!! 任意リンク\n\n次の条件に該当するテキストはリンクとして処理します:\n\n* \'[[\'ではじまる。\n* \']]\'で終わる。\n* \'|\'の前に表記を、うしろにURLまたはWikiNameを記述する。\n\n[[Planet HTML5|http://www.w3.org/html/planet/]]\n\n!! 修飾\n\n* "\'"2個で囲んだ部分は\'\'強調\'\'します。\n* "\'"3個で囲んだ部分は\'\'\'より強調\'\'\'します。\n* \'=\'2個で囲んだ部分は==取り消し線==で修飾します。\n',
			'lastUpdateTime' : null
		};

		if (this.isStorageAvailable() && this._storage.isInitialized() === false) {
			for (var index = 0; index < this._pageList.length; index++) {
				var pageName = this._pageList[index];
				var page = this._pages[pageName];
				this._storage.storePage(pageName, page.title, page.content, true);
			}
		}
	}
}
