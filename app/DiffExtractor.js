/**
 * @fileOverview CliWiki diff extraction class definitions
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
// Class definitions
//

/**
 * DiffPartType
 *
 * @class Diff sequence part type enumuration.
 */
var DiffPartType = {
	/**
	 * Share value.
	 * @type {Number}
	 */
	SHARE: 0,

	/**
	 * From value.
	 * @type {Number}
	 */
	FROM: 1,

	/**
	 * To value.
	 * @type {Number}
	 */
	TO: 2
}

/**
 * DiffSequence
 *
 * @class Diff sequence.
 * @param {Number} partType Part type.
 * @param {Array} seq Sequences.
 */
function DiffSequence(partType, seq) {
    /**
     * Part type.
     * @type {Number}
     */
	this.part = partType;

	/**
     * Sequence.
     * @type {Array}
     */
	this.sequences = new Array();
	if (typeof seq.join !== 'undefined') {
		this.sequences = this.sequences.concat(seq);
	}
	else {
		this.sequences.push(seq);
	}
}
DiffSequence.prototype = {
	//
	// Public functions
	//

	/**
	 * Add sequence data to first.
	 *
	 * @param {Object} Sequence data.
	 */
	addToFirst: function(seq) {
		this.sequences.unshift(seq);
	}
}

/**
 * Node information of edit graph.
 *
 * @class Node information of edit graph.
 * @param {Number} x X coordinate.
 * @param {Number} y Y coordinate.
 * @param {Object} prev Previous node of edit graph.
 */
function EditGraphNode(x, y, prev) {
    /**
     * X coordinate.
     * @type {Number}
     */
	this.x = x;

    /**
     * Y coordinate.
     * @type {Number}
     */
	this.y = y;

    /**
     * Previous node of edit graph.
     * @type {Object}
     */
	this.prev = prev;
}

/**
 * MeyersEditGraphFinder
 *
 * @class Edit graph finder based on Meyer's algorithm
 * @param {Array} lhs LValue
 * @param {Array} rhs RValue
 */
function MeyersEditGraphFinder(lhs, rhs) {
	/**
	 * LValue.
	 * @type {Array}
	 */
	this._lhs = lhs;

	/**
	 * RValue.
	 * @type {Array}
	 */
	this._rhs = rhs;

	/**
	 * Node type enumeration.
	 * @type {Object}
	 */
	this._vectorType = {
		/**
		 * Initialize value.
		 * @type {Number}
		 */
		INIT: 0,

		/**
		 * X coordinate value.
		 * @type {Number}
		 */
		X: 1,

		/**
		 * Y coordinate value.
		 * @type {Number}
		 */
		Y: 2
	};
}
MeyersEditGraphFinder.prototype = {
	//
	// Public functions
	//

	/**
	 * Find edit graph
	 *
	 * @return {Array} Difference sequences
	 */
    findEditGraph: function() {
		var endNode = null;

		var farthestEndNodes = this._createFarthestEndNodesContainer(2 * (this._lhs.length + this._rhs.length) + 1);
		var offset = this._rhs.length + 1;

		for (var d = 0; d <= this._lhs.length + this._rhs.length; d++) {
			var maxK = (d <= this._lhs.length)
					? d
					: (this._lhs.length - (d - this._lhs.length));
			var minK = (d <= this._rhs.length)
					? d
					: (this._rhs.length - (d - this._rhs.length));
			for (var k = -minK; k <= maxK; k += 2) {
				var x = 0;
				var y = 0;
				var prev = null;

				var index = offset + k;
				var vecType = this._getVectorType(farthestEndNodes, index);
				switch (vecType) {
					case this._vectorType.INIT:
						prev = new EditGraphNode(x, y, null);
						x = 0;
						y = 0;
						break;

					case this._vectorType.X:
						prev = farthestEndNodes[index + 1];
						x = prev.x;
						y = prev.y + 1;
						break;

					case this._vectorType.Y:
						prev = farthestEndNodes[index - 1];
						x = prev.x + 1;
						y = prev.y;
						break;

					default:
						throw new Error('Invalid switch value:' + vecType);
				}

				var moved = this._snake(x, y);
				x = moved.x;
				y = moved.y;

				farthestEndNodes[index] = new EditGraphNode(x, y, prev);
				if (this._lhs.length <= x && this._rhs.length <= y) {
					endNode = farthestEndNodes[index];
					break;
				}
			}
			if (endNode !== null) {
				break;
			}
		}

		return endNode;
	},

	//
	// Private functions
	//

	/**
	 * Create farthest end nodes stock array.
	 *
	 * @param {Number} size Size of stock array.
	 * @return {Array} Farthest end nodes stock array.
	 */
	_createFarthestEndNodesContainer: function(size) {
		var farthestEndNodes = new Array();
		for (var index = 0; index < size; index++) {
			farthestEndNodes.push(null);
		}
		return farthestEndNodes;
	},

	/**
	 * Decide node vector type.
	 *
	 * @param {Array} farthestEndNodes Array of farthest end nodes.
	 * @param {Number} index Index of farthest end nodes array.
	 * @return {Number} Vector type.
	 */
	_getVectorType: function(farthestEndNodes, index) {
		var vectorType;
		var minusNode = index <= 0 ? null : farthestEndNodes[index - 1];
		var plusNode = farthestEndNodes.Count <= index ? null : farthestEndNodes[index + 1];

		if (minusNode === null && plusNode === null) {
			vectorType = this._vectorType.INIT;
		}
		else if (minusNode === null) {
			vectorType = this._vectorType.X;
		}
		else if (plusNode === null) {
			vectorType = this._vectorType.Y;
		}
		else {
			vectorType = minusNode.x < plusNode.x
						? this._vectorType.X
						: this._vectorType.Y;
		}
		return vectorType;
	},

	/**
	  * Trace common sequence.
	  * @param {Number} x X coordinate.
	  * @param {Number} y Y coordinate.
	  * @return {Object} Moved coordinate.
	  */
	_snake: function(x, y) {
		var movedX = x;
		var movedY = y;

		while (movedX < this._lhs.length
		&& movedY < this._rhs.length
		&& this._lhs[movedX] == this._rhs[movedY]) {
			++movedX;
			++movedY;
		}
		return {
			x: movedX,
			y: movedY
		};
	}
}

/**
 * DiffExtractor
 *
 * @class Diff extraction class
 */
function DiffExtractor() {
}
DiffExtractor.prototype = {
	//
	// Public functions
	//

	/**
	 * Extract diffrence sequences
	 *
	 * @param {Array} lhs LValue.
	 * @param {Array} rhs RValue.
	 * @return {Array} Difference sequences
	 */
	extract: function(lhs, rhs) {
		var sequences = new Array();

		var node = new MeyersEditGraphFinder(lhs, rhs).findEditGraph();
		while (node !== null && node.prev !== null) {
			var prev = node.prev;

			var diffX = node.x - prev.x;
			var diffY = node.y - prev.y;
			var shareLen = Math.min(diffX, diffY);

			if (0 < shareLen) {
				var share = new Array();
				for (var i = 0; i < shareLen; i++) {
					share.unshift(lhs[node.x - i - 1]);
				}
				sequences.unshift(new DiffSequence(DiffPartType.SHARE, share));
			}

			if (diffY < diffX) {
				if (0 < sequences.length
				&& sequences[0].part === DiffPartType.FROM) {
					sequences[0].addToFirst(lhs[prev.x]);
				}
				else {
					sequences.unshift(new DiffSequence(DiffPartType.FROM, lhs[prev.x]));
				}
			}
			else if (diffX < diffY) {
				if (0 < sequences.length && sequences[0].part === DiffPartType.TO) {
					sequences[0].addToFirst(rhs[prev.y]);
				}
				else {
					sequences.unshift(new DiffSequence(DiffPartType.TO, rhs[prev.y]));
				}
			}

			node = prev;
		}

		return sequences;
	}
}
