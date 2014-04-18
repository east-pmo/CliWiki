/**
 * @fileOverview TextCatalogue class definition
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012-2014 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.6.1.1(20140418)
 */

//
// Class definition
//

/**
 * TextCatalogue
 *
 * @class Text catalogue class
 * @param {String} lang Language of catalogue.
 */
function TextCatalogue(lang) {
    /**
     * Text catalogue.
     * @return {String}
     */
	this._catalogue = null;
	switch (lang) {
		case 'ja':
			this._catalogue = {
				'FrontPage can\'t delete.' : 'FrontPageは削除できません。',

				'Do you want to initialize the local storage?' : 'ローカルストレージを初期化しますか?',
				': Do you want to delete this page?' : ': このページを削除しますか?',

				'Keyword' : 'キーワード',
				'Page name' : 'ページ名',
				'Comparison...' : '比較...',
				'Processing...' : '処理中...',
				'Invalid data.' : '無効な形式です。',
				'Imported.' : 'インポートしました。',
				'Imported, but no change.' : 'インポートした結果、更新はありませんでした。',
				'Cancel update' : '更新取消',
				'Cancel latest update, OK?' : '最後の更新を取り消します。よろしいですか?'
			};
			break;
	}
}
TextCatalogue.prototype = {
	//
	// Public function
	//

    /**
     * Get translated text.
	 * @param {String} text Original text.
	 * @return {String} Translated text.
     */
	getText: function(text) {
		var translated = text;
		if (this._catalogue !== null) {
			translated = this._catalogue[text];
		}
		return (typeof translated == 'undefined' ? text : translated)
	}
}
