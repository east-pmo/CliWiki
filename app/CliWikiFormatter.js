/**
 * @fileOverview WikiText formatter class definitions
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
 * FormatUtilities
 * 
 * @class Format utilities static class
 */
var FormatUtilities = {
	//
	// Public functions
	//

	/**
     * Escape xhtml special character.
     * 
     * @param {String}  Target text
     * @return {String} Escaped text
     */
  	escape: function(text) {
		var targets = [
			{ 'char' : '&', 'ref' : '&amp;' },
			{ 'char' : '<', 'ref' : '&lt;' },
			{ 'char' : '>', 'ref' : '&gt;' },
			{ 'char' : '\'', 'ref' : '&apos;' },
			{ 'char' : '"', 'ref' : '&quot;' }
		];

		var replaced = text;
		for (var index = 0; index < targets.length; index++) {
			var re = new RegExp(targets[index].char, 'igm');
			replaced = replaced.replace(re, targets[index].ref);
		}
		return replaced;
	},

	/**
     * Count number of specific character at beginning of the text.
     * 
     * @param {String} text Target text
     * @param {String} countChar Character to count
     * @return {Number} Number of character
     */
	countStartChar: function(text, countChar) {
		var index = 0;
		while (index < text.length) {
			if (text.charAt(index) !== countChar) {
				break;
			}
			++index;
		}
		return index;
	},

	/**
     * Make XHTML element start tag.
     *
     * @param {String} name element name.
     * @param {Array} attributes element attributes.
     * @return {String} XTHML element start tag.
     */
	makeStartTag: function(name, attributes) {
		var startTag = '<' + name;
		if (attributes !== undefined
		&& attributes != null
		&& 0 < attributes.length) {
			for (var index = 0; index < attributes.length; index++) {
				startTag += ' '
							+ FormatUtilities.escape(attributes[index].name)
							+ '=\''
							+ FormatUtilities.escape(attributes[index].value.toString())
							+ '\'';
			}
		}
		startTag += '>';
		return startTag;
	},

	/**
     * Make XHTML element empty tag.
     *
     * @param {String} name element name.
     * @param {Array} attributes element attributes.
     * @return {String} XTHML element empty tag.
     */
	makeEmptyTag: function(name, attributes) {
		var tag = '<' + name;
		if (attributes !== undefined
		&& attributes != null
		&& 0 < attributes.length) {
			for (var index = 0; index < attributes.length; index++) {
				tag += ' '
							+ FormatUtilities.escape(attributes[index].name)
							+ '=\''
							+ FormatUtilities.escape(attributes[index].value.toString())
							+ '\'';
			}
		}
		tag += '/>';
		return tag;
	},

	/**
     * Make XHTML element end tag.
     *
     * @param {String} name element name.
     * @return {String} XTHML end tag.
     */
	makeEndTag: function(name) {
		return '</' + name + '>';
	},

	/**
     * Check phrase is wiki name
     *
     * @return {String} phrase target phrase.
     * @return {Boolean} True if phrase is wiki name.
     */
	isWikiName: function(phrase) {
		return phrase.search(/^([A-Z][a-z0-9]+){2,}$/) === 0;
	}
}

/** 
 * HeadingFormatterCreater
 * 
 * @class Heading formatter creator
 */
function HeadingFormatterCreator() {
}
HeadingFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		var result = false;

		var line = lines[index]
		var headingCount = FormatUtilities.countStartChar(line, '!');
		if (0 < headingCount && headingCount < 5) {
			result = (0 < line.replace(/^\!+[ 　]*/, '').length);
		}
		return result;
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {HeaddingFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new HeadingFormatter(allowFileScheme);
	}
}

/** 
 * ListFormatterCreater
 * 
 * @class List formatter creator
 */
function ListFormatterCreator() {
}
ListFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		var line = lines[index];
		return line.indexOf('#') === 0 || line.indexOf('*') === 0;
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {ListFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new ListFormatter(allowFileScheme);
	}
}

/** 
 * DefinitionListFormatterCreater
 * 
 * @class Definition list formatter creator
 */
function DefinitionListFormatterCreator() {
}
DefinitionListFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		var line = lines[index];
		return line.indexOf(':') === 0 && 1 < line.lastIndexOf(':');
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {DefinitionListFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new DefinitionListFormatter(allowFileScheme);
	}
}

/** 
 * TableFormatterCreater
 * 
 * @class Table formatter creator
 */
function TableFormatterCreator() {
}
TableFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format.
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		return lines[index].indexOf('||') === 0;
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {TableFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new TableFormatter(allowFileScheme);
	}
}

/**
 * CommentFormatterCreater
 * 
 * @class Comment formatter creator
 */
function CommentFormatterCreator() {
}
CommentFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		return lines[index].indexOf('//') === 0;
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {HeaddingFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new CommentFormatter(allowFileScheme);
	}
}

/**
 * HorizontalRuleFormatterCreater
 * 
 * @class Horizontal rule formatter creator
 */
function HorizontalRuleFormatterCreator() {
}
HorizontalRuleFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		return lines[index] === '----';
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {HorizontalRuleFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new HorizontalRuleFormatter(allowFileScheme);
	}
}

/** 
 * PreFormatterCreater
 * 
 * @class Pre formatter creator
 */
function PreFormatterCreator() {
}
PreFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		var line = lines[index];
		return line.indexOf(' ') === 0
				|| line.indexOf('\t') === 0
				|| line === '<<<';
	},

	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {PreFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new PreFormatter(allowFileScheme);
	}
}

/** 
 * ParagraphFormatterCreater
 * 
 * @class Paragraph formatter creator
 */
function ParagraphFormatterCreator() {
}
ParagraphFormatterCreator.prototype = {
	//
	// Public function
	//

	/** 
	 * Judgement to create.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} index Target line index.
	 * @return {Boolean} Result
	 */
	canCreate: function(lines, index) {
		return 0 < lines[index].length;
	},
	
	/** 
	 * Create formatter instance.
	 * 
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {ParagraphFormatter} Formatter instance.
	 */
	createFormatter: function(allowFileScheme) {
		return new ParagraphFormatter(allowFileScheme);
	}
}

/** 
 * TextFormatter
 * 
 * @class Text formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function TextFormatter(allowFileScheme) {
    /**
     * Decoration patterns
     * @return {Array}
     */
	this._patterns = [
		{ 'pattern': '\'\'\'', 'element': 'strong' },
		{ 'pattern': '\'\'', 'element': 'em' },
		{ 'pattern': '==', 'element': 'del' }
	];

    /**
     * Image url extensions
     * @return {Array}
     */
	this._imageExts = [
		'.jpg',
		'.jpeg',
		'.gif',
		'.png'
	];

    /**
     * Allof file scheme flag
     * @return {Boolean}
     */
	this._allowFileScheme = (allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
TextFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format text
	 * 
	 * @param {String} text Target text
	 * @return {String} Formatted text
	 */
	format: function(text) {
		var formatted = '';

		var phrases = this._splitPhrase(text.trim());
		for (var index = 0; index < phrases.length; index++) {
			var phrase = phrases[index];
			if (0 < phrase.trim(' ').length) {
				if (0 < index) {
					formatted += ' ';
				}
				formatted += this._formatPhrase(phrase);
			}
		}
		return formatted;
	},

	//
	// Private function
	//

	/**
	 * Get link url regular expression pattern.
	 *
	 * @return {Regex} Link url regular expression pattern.
	 */
	_getLinkUrlPattern: function() {
		return this._allowFileScheme
				? /(https?|file):/
				: /https?:/;
	},

	/**
	 * Split text to (internal) phrase
	 *
	 * @param {String} text Target text
	 * @return {Array} Splitted phrases.
	 */
	_splitPhrase: function(text) {
		var processText = text;
		var phrases = new Array();
		while (true) {
			var processed = false;
			var start = processText.search(this._getLinkUrlPattern());
			if (start === 0
			|| (0 < start && processText.charAt(start - 1) === ' ')) {
				var end = processText.indexOf(' ', start);
				if (start < end) {
					phrases.push(processText.substring(0, start).trim());
					phrases.push(processText.substring(start, end).trim());
					processText = processText.substring(end).trim();
					processed = true;
				}
			}

			if (processed === false) {
				var match = processText.match(/([A-Z][a-z0-9]+){2,}/);
				if (match !== null) {
					start = match.index;
					if (start === 0 
					|| (0 < start && processText.charAt(start - 1) === ' ')) {
						var wikiName = match[0];
						var end = start + wikiName.length;
						if (end + 1 === processText.length
						|| processText.charAt(end) === ' ') {
							phrases.push(processText.substring(0, start).trim());
							phrases.push(wikiName);
							processText = processText.substring(end).trim();
							processed = true;
						}
					}
				}
			}
			if (processed === false) {
				break;
			}
		}
		phrases.push(processText);
		return phrases;
	},

	/**
	 * Check target of url is image.
	 *
	 * @param {String} url Target url
	 * @return {Boolean} True if target of url is image.
	 */
	_isImageUrl: function(url) {
		var isImage = false;
		var splitPos = url.lastIndexOf('.');
		if (0 < splitPos) {
			var ext = url.substring(splitPos).toLowerCase();
			for (var index = 0; index < this._imageExts.length && isImage === false; index++) {
				isImage = (ext === this._imageExts[index]);
			}
		}
		return isImage;
	},

	/**
	 * Check phrase is outer link.
	 *
	 * @param {String} url Target phrase
	 * @return {Boolean} True if phrase is outer link.
	 */
	_isOuterLink: function(phrase) {
		return phrase.search(this._getLinkUrlPattern()) === 0;
	},

	/**
	 * Check phrase is WikiName.
	 *
	 * @param {String} url Target phrase
	 * @return {Boolean} True if phrase is WikiName.
	 */
	_isWikiName: function(phrase) {
		return phrase.search(/^([A-Z][a-z0-9]+){2,}$/) === 0;
	},

	/**
	 * Make WikiName link element.
	 *
	 * @param {String} url Target WikiName
	 * @return {String} Link element string
	 */
	_makeWikiNameLinkElement: function(wikiName, literal) {
		var startTag = FormatUtilities.makeStartTag('a', [
			{ 'name': 'href', 'value': '#' },
			{ 'name': 'class', 'value': 'wikiPage' },
			{ 'name': 'title', 'value': wikiName }
		]);
		return startTag +  FormatUtilities.escape(literal) + '</a>';
	},

	/**
	 * Make link element
	 *
	 * @param {String} url Link target url
	 * @param {String} literal Link literal
	 * @return {String} Link element string
	 */
	_makeLinkElement: function(url, literal) {
		var startTag = FormatUtilities.makeStartTag('a', [
			{ 'name': 'href', 'value': url },
			{ 'name': 'target', 'value': '_blank' }
		]);
		return startTag +  FormatUtilities.escape(literal) + '</a>';
	},

	/**
	 * Format link
	 *
	 * @param {String} phrase Target phrase
	 * @return {String} Formatted phrase
	 */
	_formatLink: function(phrase) {
		var start = phrase.indexOf('[[');
		if (start < 0) {
			return '';
		}

		var end = phrase.indexOf(']]', start + 2);
		if (end <= start) {
			return '';
		}

		var text = this._formatText(phrase.substring(start + 2, end));
		var separator = text.indexOf('|');
		if (separator <= 0) {
			return '';
		}

		var literal = text.substring(0, separator);
		var link = text.substring(separator + 1);
		if (FormatUtilities.isWikiName(link) === false
		&& this._isOuterLink(link) === false) {
			return '';
		}

		return [
			this._formatText(phrase.substring(0, start)),
			FormatUtilities.isWikiName(link)
				? this._makeWikiNameLinkElement(link, literal)
				: this._formatLinkUrl(link, literal),
			this._formatText(phrase.substring(end + 2))
		].join('');
	},

	/**
	 * Format decoration
	 *
	 * @param {String} phrase Target phrase
	 * @return {String} Formatted phrase
	 */
	_formatDecoration: function(phrase) {
		var formatted = '';
		for (var index = 0; index < this._patterns.length; index++) {
			var pattern = this._patterns[index];
			var start = phrase.indexOf(pattern.pattern);
			if (0 <= start) {
				var end = phrase.indexOf(pattern.pattern, start + pattern.pattern.length);
				if (start < end) {
					formatted = this._formatText(phrase.substring(0, start));
					formatted += '<' + pattern.element + '>'
							+ this._formatText(phrase.substring(start + pattern.pattern.length, end))
								+ FormatUtilities.makeEndTag(pattern.element);
					formatted += this._formatText(phrase.substring(end + pattern.pattern.length));

					break;
				}
			}
		}
		return formatted;
	},

	/**
	 * Format text
	 *
	 * @param {String} phrase Target phrase
	 * @return {String} Formatted phrase
	 */
	_formatText: function(phrase) {
		var formatted = this._formatLink(phrase);
		if (formatted.length === 0) {
			formatted = this._formatDecoration(phrase);
		}
		if (formatted.length === 0) {
			formatted = FormatUtilities.escape(phrase);
		}
		return formatted;
	},

	/** 
	 * Format link url
	 * 
	 * @param {String} url Target url.
	 * @param {String} literal Literal.
	 * @return {String} Formatted url.
	 */
	_formatLinkUrl: function(url, literal) {
		var formatted = '';
		if (this._isImageUrl(url)) {
			var val = FormatUtilities.escape(literal);
			formatted = FormatUtilities.makeEmptyTag('img', [
				{ 'name': 'src', 'value': url },
				{ 'name': 'alt', 'value': val },
				{ 'name': 'title', 'value': val }
			]);
		}
		else {
			formatted = this._makeLinkElement(url, literal);
		}
		return formatted;
	},

	/** 
	 * Format phrase
	 * 
	 * @param {String} text Target phrase
	 * @return {String} Formatted phrase
	 */
	_formatPhrase: function(phrase) {
		var formatted = '';
		if (this._isWikiName(phrase)) {
			formatted = this._makeWikiNameLinkElement(phrase, phrase);
		}
		else if ((this._allowFileScheme && phrase.match(/^(https?|file):\/\/.+$/))
		|| (this._allowFileScheme === false && phrase.match(/^https?:\/\/.+$/))) {
			// Auto link
			formatted += this._formatLinkUrl(phrase, phrase);
		}
		else {
			formatted = this._formatText(phrase);
		}
		return formatted;
	}
}

/** 
 * HeadingFormatter
 * 
 * @class Heading formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function HeadingFormatter(allowFileScheme) {
    /**
     * Allof file scheme flag
     * @return {Boolean}
     */
	this._allowFileScheme = (allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
HeadingFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		var textFormatter = new TextFormatter(this._allowFileScheme);

		var line = lines[index];
		var headingCount = FormatUtilities.countStartChar(line, '!');
		var tag = 'h' + (headingCount + 1).toString();
		return {
			'formatted' : '<' + tag + '>'
							+ textFormatter.format(line.substring(headingCount))
							+ FormatUtilities.makeEndTag(tag),
			'index' : index + 1
		};
	}
}

/** 
 * ListFormatter
 * 
 * @class List formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function ListFormatter(allowFileScheme) {
    /**
     * Text formatter
     * @return {TextFormatter}
     */
	this._formatter = new TextFormatter(allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
ListFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		return this._formatList(lines, index, 1);
	},

	//
	// Private function
	//

	/** 
	 * Format list items
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @param {Number} level Nest level
	 * @return {String} Formatted text
	 */
	_formatList: function(lines, index, level) {
		var line = lines[index];

		var ordered = line.indexOf('#') === 0;
		var markUpChar = ordered ? '#' : '*';

		var formatted = '';
		while (index < lines.length) {
			var nestLevel = FormatUtilities.countStartChar(line, markUpChar);
			if (nestLevel < level) {
				break;
			}
			formatted += '<li>';
			formatted += this._formatter.format(line.substring(level));
			++index;
			if (lines.length <= index) {
				formatted += '</li>'
				break;
			}

			nestLevel = FormatUtilities.countStartChar(lines[index], markUpChar);
			if (level < nestLevel) {
				var result = this._formatList(lines, index, level + 1);
				formatted += result.formatted;
				index = result.index;
			}
			formatted += '</li>'
			line = lines[index];
		}

		var tag = ordered ? 'ol' : 'ul';
		return {
			'formatted' : '<' + tag + '>'
							+ formatted
							+ FormatUtilities.makeEndTag(tag),
			'index' : index
		};
	}
}

/** 
 * DefinitionListFormatter
 * 
 * @class Definition list formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function DefinitionListFormatter(allowFileScheme) {
    /**
     * Text formatter
     * @return {TextFormatter}
     */
	this._formatter = new TextFormatter(allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
DefinitionListFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		return this._formatDefinitionList(lines, index);
	},

	//
	// Private function
	//

	/** 
	 * Format list items
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	_formatDefinitionList: function(lines, index) {
		var line = lines[index];

		var formatted = '';
		while (index < lines.length) {
			if (line.indexOf(':') !== 0) {
				break;
			}
			var splitPos = line.indexOf(':', 1);
			if (splitPos < 0) {
				break;
			}
			var title = line.substring(1, splitPos);
			var definition = line.substring(splitPos + 1);
			formatted += '<dt>' + this._formatter.format(title) + '</dt>';
			formatted += '<dd>' + this._formatter.format(definition) + '</dd>';

			++index;
			line = lines[index];
		}

		return {
			'formatted' : '<dl>' + formatted + '</dl>',
			'index' : index
		};
	}
}

/** 
 * TableFormatter
 * 
 * @class Table formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function TableFormatter(allowFileScheme) {
    /**
     * Text formatter creator
     * @return {TableFormatterCreator}
     */
	this._creator = new TableFormatterCreator();

	/**
     * Text formatter
     * @return {TextFormatter}
     */
	this._textFormatter = new TextFormatter(allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
TableFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		var rows = new Array();
		while (index < lines.length) {
			if (lines[index].length === 0
			|| this._creator.canCreate(lines, index) === false) {
				break;
			}
			rows.push(lines[index++]);
		}
		return {
			'formatted' : '<table border="1">' + this._formatRows(rows) + '</table>',
			'index' : index
		};
	},

	//
	// Private function
	//

	/** 
	 * Format rows
	 * 
	 * @param {Array} rows Target row lines
	 * @return {String} Formatted text
	 */
	_formatRows: function(rows) {
		var formatted = '';
		for (var index = 0; index < rows.length; index++) {
			var columns = rows[index].split('||');
			columns.shift();
			formatted += '<tr>' + this._formatColumns(columns) + '</tr>';
		}
		return formatted;
	},

	/** 
	 * Format columns
	 * 
	 * @param {Array} columns Target column text
	 * @return {String} Formatted text
	 */
	_formatColumns: function(columns) {
		var formatted = '';
		for (var index = 0; index < columns.length; index++) {
			var attr = '';
			var column = columns[index];
			var heading = (column.indexOf('!') === 0);
			if (heading) {
				column = column.substring(1);
			}

			var attributes = new Array();
			var rowSpan = FormatUtilities.countStartChar(column, '^');
			if (0 < rowSpan) {
				column = column.substring(rowSpan);
				attributes.push({ 'name' : 'rowspan', 'value': rowSpan + 1 });
			}
			var colSpan = FormatUtilities.countStartChar(column, '>');
			if (0 < colSpan) {
				column = column.substring(colSpan);
				attributes.push({ 'name' : 'colspan', 'value': colSpan + 1 });
			}

			var elem = heading ? 'th' : 'td';
			formatted += FormatUtilities.makeStartTag(elem, attributes)
						+ this._textFormatter.format(column)
						+ FormatUtilities.makeEndTag(elem);
		}
		return formatted;
	}
}

/** 
 * HorizontalRuleFormatter
 * 
 * @class Horizontal rule formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function HorizontalRuleFormatter(allowFileScheme) {
}
HorizontalRuleFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		return {
			'formatted' : '<hr />',
			'index' : index + 1
		};
	}
}

/** 
 * CommentFormatter
 * 
 * @class Comment formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function CommentFormatter(allowFileScheme) {
}
CommentFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		return {
			'formatted' : '',
			'index' : index + 1
		};
	}
}

/** 
 * PreFormatter
 * 
 * @class Pre formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function PreFormatter(allowFileScheme) {
    /**
     * Allof file scheme flag
     * @return {Boolean}
     */
	this._allowFileScheme = (allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
PreFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		var textFormatter = new TextFormatter(this._allowFileScheme);
		var creator = new PreFormatterCreator();

		var formatted = '';
		var lineMode = (lines[index] !== '<<<');
		var asStart = true;
		while (index < lines.length) {
			var line = lines[index];
			if (lineMode !== false
			&& (line.length === 0 || creator.canCreate(lines, index) === false)) {
				break;
			}

			++index;

			if (lineMode === false && line === '>>>') {
				break;
			}

			if (lineMode !== false || line !== '<<<') {
				if (asStart !== false) {
					asStart = false;
				}
				else {
					formatted += '\n';
				}
				formatted += line.trim();
			}
		}
		return {
			'formatted' : '<pre>' + textFormatter.format(formatted) + '</pre>',
			'index' : index
		};
	}
}

/** 
 * PargraphFormatter
 * 
 * @class Paragraphg formatter
 * @param {Boolean} allowFileScheme Allow file shceme in link format.
 */
function ParagraphFormatter(allowFileScheme) {
    /**
     * Allof file scheme flag
     * @return {Boolean}
     */
	this._allowFileScheme = (allowFileScheme !== undefined
							&& allowFileScheme !== false);
}
ParagraphFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format lines
	 * 
	 * @param {Array} lines Target lines
	 * @param {Number} index Index of target lines
	 * @return {String} Formatted text
	 */
	format: function(lines, index) {
		var textFormatter = new TextFormatter(this._allowFileScheme);

		var formatted = '';
		while (index < lines.length) {
			if (lines[index].length === 0) {
				break;
			}
			formatted += lines[index++];
		}
		return {
			'formatted' : '<p>' + textFormatter.format(formatted) + '</p>',
			'index' : index
		};
	}
}

/** 
 * CliWikiFormatter
 * 
 * @class CliWiki markup formatter
 */
function CliWikiFormatter() {
    /**
     * Formatter creators
     * @return {Array}
     */
	this._creators = [
		new HeadingFormatterCreator(),
		new ListFormatterCreator(),
		new DefinitionListFormatterCreator(),
		new TableFormatterCreator(),
		new CommentFormatterCreator(),
		new HorizontalRuleFormatterCreator(),
		new PreFormatterCreator(),
		new ParagraphFormatterCreator()
	];
}
CliWikiFormatter.prototype = {
	//
	// Public function
	//

	/** 
	 * Format contents
	 * 
	 * @param {String} contents CliWiki markuped text
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {String} Formatted text
	 */
	format: function(contents, allowFileScheme) {
		var formatted = '';

		var lines = 0 <= contents.indexOf('\n')
					? contents.split('\n')
					: [ contents ];
		var index = 0;
		while (index < lines.length) {
			if (0 < lines[index].length) {
				var formatter = this._getFormatter(lines, index, allowFileScheme);
				if (formatter !== null) {
					result = formatter.format(lines, index);
					formatted += result.formatted;
					index = result.index;
				}
				else {
					++index;
				}
			}
			else {
				++index;
			}
		}

		return formatted;
	},

	//
	// Private function
	//

	/** 
	 * Get formatter.
	 * 
	 * @param {Array} lines Line array to format
	 * @param {Number} lineIndex Target line index.
	 * @param {Boolean} allowFileScheme Allow file shceme in link format.
	 * @return {Formatter} Instance to format.
	 */
	_getFormatter: function(lines, lineIndex, allowFileScheme) {
		var formatter = null;

		for (var index = 0; index < this._creators.length; index++) {
			if (this._creators[index].canCreate(lines, lineIndex)) {
				formatter = this._creators[index].createFormatter(allowFileScheme);
				break;
			}
		}
		return formatter;
	}
}
