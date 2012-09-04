/**
 * @fileOverview Formatter test
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2012 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version development
 */

//
// Class definition
//

/** 
 * FormatUtilitiesTest
 * 
 * @class Test case definition class for FormatUtilities.
 */
function FormatUtilitiesTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'FormatUtilitiesTest';
}
FormatUtilitiesTest.prototype = {
	//
	// Test function
	//

    /**
     * Test FormatUtilities#escape function.
     */
	testEscape: function() {
		var cases = [
			{ 'first' : '\'', 'second' : '&apos;' },
			{ 'first' : '\"', 'second' : '&quot;' },
			{ 'first' : '&', 'second' : '&amp;' },
			{ 'first' : '<', 'second' : '&lt;' },
			{ 'first' : '>', 'second' : '&gt;' },
			{ 'first' : '<>', 'second' : '&lt;&gt;' },
			{ 'first' : '<tag>', 'second' : '&lt;tag&gt;' }
		];
		for (var index = 0; index < cases.length; index++) {
			Assert.assert(FormatUtilities.escape(cases[index].first) === cases[index].second);
		}
	},

    /**
     * Test FormatUtilities#countStartChar function.
     */
	testCountStartChar: function() {
		Assert.assert(FormatUtilities.countStartChar('! heading', '!') === 1);
		Assert.assert(FormatUtilities.countStartChar('!! heading', '!') === 2);
		Assert.assert(FormatUtilities.countStartChar('@@ heading', '!') === 0);
		Assert.assert(FormatUtilities.countStartChar('!! ! heading', '!') === 2);
	},

    /**
     * Test FormatUtilities#makeStartTag function.
     */
	testMakeStartTag: function() {
		Assert.assert(FormatUtilities.makeStartTag('p') === '<p>');
		Assert.assert(FormatUtilities.makeStartTag('table', [{
			'name' : 'border',
			'value' : 1
		}]) === '<table border=\'1\'>');
	},

    /**
     * Test FormatUtilities#makeEndTag function.
     */
	testMakeEndTag: function() {
		Assert.assert(FormatUtilities.makeEndTag('p') === '</p>');
	}
}

/** 
 * FormatterCreatorTest
 * 
 * @class Test case definition class for formatter creator
 */
function FormatterCreatorTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'FormatterCreatorTest';
}
FormatterCreatorTest.prototype = {
	//
	// Test function
	//

    /**
     * Test HeadingFormatterCreator#canCreate function.
     */
	testCanHeadingFormatterCreatorCreate: function() {
		var creator = new HeadingFormatterCreator();
		var validLines = [
			['! Heading'],
			['!! Heading'],
			['!!! Heading'],
			['!!!! Heading']
		];
		this._checkCanCreate(creator, validLines, 0);
		var invalidLines = [
			['!'],
			['!!'],
			['!!!'],
			['!!!!'],
			['No heading mark.'],
			['!!!!!'],
			[' !!!']
		];
		this._checkCannotCreate(creator, invalidLines, 0);
	},

    /**
     * Test ListFormatterCreator#canCreate function.
     */
	testCanListFormatterCreatorCreate: function() {
		var creator = new ListFormatterCreator();
		var validLines = [
			['*'],
			['#'],
			['** Second level'],
			['### 3rd Level'],
			['# ## 1st Level']
		];
		this._checkCanCreate(creator, validLines, 0);
		var invalidLines = [
			[' *'],
			[' ##']
		];
		this._checkCannotCreate(creator, invalidLines, 0);
	},

    /**
     * Test DefinitionListFormatterCreator#canCreate function.
     */
	testCanDefinitionListFormatterCreatorCreate: function() {
		var creator = new DefinitionListFormatterCreator();
		var validLines = [
			[':heading:body']
		];
		this._checkCanCreate(creator, validLines, 0);
		var invalidLines = [
			[' :heading:body'],
			['! heading'],
			['* list']
		];
		this._checkCannotCreate(creator, invalidLines, 0);
	},

    /**
     * Test TableFormatterCreator#canCreate function.
     */
	testCanTableFormatterCreatorCreate: function() {
		var creator = new TableFormatterCreator();
		var validLines = [
			['||heading||']
		];
		this._checkCanCreate(creator, validLines, 0);
		var invalidLines = [
			['! heading'],
			[' ||heading||'],
			['heading']
		];
		this._checkCannotCreate(creator, invalidLines, 0);
	},

    /**
     * Test CommentFormatterCreator#canCreate function.
     */
	testCanCommentFormatterCreatorCreate: function() {
		var creator = new CommentFormatterCreator();
		var validLines = [
			['// Comment Line'],
			['//'],
			['/// Comment'],
			['// ']
		];
		this._checkCanCreate(creator, validLines, 0);
		var invalidLines = [
			['/ Comment'],
			['/ /'],
			[' //']
		];
		this._checkCannotCreate(creator, invalidLines, 0);
	},

	//
	// Private function
	//

    /**
     * Check can create.
     */
	_checkCanCreate: function(creator, lines, lineIndex) {
		for (var index = 0; index < lines.length; index++) {
			Assert.assert(creator.canCreate(lines[index], lineIndex), lines[index]);
		}
	},

    /**
     * Check can not create.
     */
	_checkCannotCreate: function(creator, lines, lineIndex) {
		for (var index = 0; index < lines.length; index++) {
			Assert.assert(creator.canCreate(lines[index], lineIndex) === false, lines[index]);
		}
	}
}

/** 
 * TextFormatterTest
 * 
 * @class Test case definition class for text formatter
 */
function TextFormatterTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'TextFormatterTest';
}
TextFormatterTest.prototype = {
	//
	// Test function
	//

    /**
     * Test TextFormatter#format function.
     */
	testFormat: function() {
		var formatter = new TextFormatter(false);

		var patterens = [
			{ 'markUp' : ' http://nkjmkzk.net/?p=1618', 'translated' : '<a href=\'http://nkjmkzk.net/?p=1618\' target=\'_blank\'>http://nkjmkzk.net/?p=1618</a>' },
			
			{ 'markUp' : '==deleted text==', 'translated' : '<del>deleted text</del>' },
			{ 'markUp' : 'This ==deleted== text', 'translated' : 'This <del>deleted</del> text' },

			{ 'markUp' : '\'\'emphasis text\'\'', 'translated' : '<em>emphasis text</em>' },
			{ 'markUp' : 'This \'\'emphasis\'\' text', 'translated' : 'This <em>emphasis</em> text' },

			{ 'markUp' : '\'\'\'strong text\'\'\'', 'translated' : '<strong>strong text</strong>' },
			{ 'markUp' : 'This \'\'\'strong\'\'\' text', 'translated' : 'This <strong>strong</strong> text' },

			{ 'markUp' : '[[EAST|http://www.est.co.jp]]', 'translated' : '<a href=\'http://www.est.co.jp\' target=\'_blank\'>EAST</a>' },
			{ 'markUp' : '[[EAST|WikiName]]', 'translated' : '<a href=\'#\' class=\'wikiPage\' title=\'WikiName\'>EAST</a>' },
			{ 'markUp' : '[[InvalidLink]]', 'translated' : '[[InvalidLink]]' },
			{ 'markUp' : '[[invalidlink|invalidlink]]', 'translated' : '[[invalidlink|invalidlink]]' },
			{ 'markUp' : '[[InvalidLink|Invalid Link]]', 'translated' : '[[InvalidLink|Invalid Link]]' }
		];
		this._checkTestPattern(formatter, patterens);
	},

	testFormatLink: function() {
		var formatter = new TextFormatter(false);

		var patterens = [
			{ 'markUp' : '[[EAST|file://C/dummy.txt]]', 'translated' : '[[EAST|file://C/dummy.txt]]' },
			{ 'markUp' : 'file://C/HTML5_Logo_128.png', 'translated' : 'file://C/HTML5_Logo_128.png' }
		];
		this._checkTestPattern(formatter, patterens);

		formatter = new TextFormatter(true);

		patterens = [
			{ 'markUp' : ' [[EAST|file://C:/dummy.txt]]', 'translated' : '<a href=\'file://C:/dummy.txt\' target=\'_blank\'>EAST</a>' },
			{ 'markUp' : 'file://C/HTML5_Logo_128.png', 'translated' : '<img src=\'file://C/HTML5_Logo_128.png\' alt=\'file://C/HTML5_Logo_128.png\' title=\'file://C/HTML5_Logo_128.png\'/>' }
		];
		this._checkTestPattern(formatter, patterens);
	},
	
	//
	// Private function
	//

    /**
     * Check test patteren
     *
     * @param {Object} formatter Test target formatter.
     * @param {Array} patterens Test patterens(mark up and translated).
     */
	_checkTestPattern: function(formatter, patterens) {
		for (var index = 0; index < patterens.length; index++) {
			var testCase = patterens[index];
			Assert.assert(formatter.format(testCase.markUp) === testCase.translated, FormatUtilities.escape(formatter.format(testCase.markUp)));
		}
	}
}

/** 
 * ListFormatterTest
 * 
 * @class Test case definition class for formatter creator
 */
function ListFormatterTest() {
    /**
     * Test name.
     * @return {String}
     */
	this.name = 'ListFormatterTest';
}
ListFormatterTest.prototype = {
	//
	// Test function
	//

     /**
     * Test ListFormatter#format function.
     */
	testFormat: function() {
		var formatter = new ListFormatter();
		var patterens = [
			{
				'markUp' : [
							'# python ベース？',
							'# http://nkjmkzk.net/?p=1618'
							],
				'translated' : '<ol><li>python ベース？</li><li><a href=\'http://nkjmkzk.net/?p=1618\' target=\'_blank\'>http://nkjmkzk.net/?p=1618</a></li></ol>'
			},
			{
				'markUp' : [ '# python ベース？' ],
				'translated' : '<ol><li>python ベース？</li></ol>'
			}
		];
		for (var index = 0; index < patterens.length; index++) {
			var testCase = patterens[index];
			var translated = formatter.format(testCase.markUp, 0);
			Assert.assert(translated.formatted === testCase.translated,
						FormatUtilities.escape(translated.formatted));
		}
	}
}