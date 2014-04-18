/**
 * @fileOverview WikiPageStocker spec description
 * http://cliwiki.codeplex.com/
 *
 * Copyright 2014 EAST Co.,Ltd.
 * Licensed under the MIT license.
 * http://cliwiki.codeplex.com/license
 *
 * @author Osada Jun(EAST Co.,Ltd. - http://www.est.co.jp/)
 * @version 0.6.1.1(20140418)
 */

//
// Entry
//

describe('WikiPageStocker', function() {
	var stocker = null;

	beforeEach(function() {
		stocker = new WikiPageStocker(100);
	});

	it('should be serialize wiki page data to JSON.', function() {
		var serialized = stocker.getSerializedData();
		var json = JSON.parse(serialized);

		expect(typeof json.FrontPage).toBe('object');
		expect(typeof json.FrontPage).not.toBe('undefined');
		expect(json.FrontPage.length).toEqual(1);

		var frontPage = json.FrontPage[0];
		expect(frontPage.title).toEqual('FrontPage');
		expect(frontPage.content).not.toBe(null);
		expect(frontPage.content).not.toEqual('');
		expect(frontPage.lastUpdateTime).toBe(null);
		expect(frontPage.markUpStyle).toEqual('cliwiki');
	});

	it('should be success to validate export data.', function() {
		var serialized = stocker.getSerializedData();
		expect(stocker.isValidData(JSON.parse(serialized))).toBeTruthy();

		var validData = {
			'FrontPage' : [
				{
					'title': 'invalid page',
					'content': 'Invalid',
					'lastUpdateTime': new Date().toISO8601String()
				}
			]
		};
		expect(stocker.isValidData(validData)).toBeTruthy();
	});

	it('should be fail to validate export data.', function() {
		expect(stocker.isValidData('')).toBeFalsy();
		expect(stocker.isValidData({})).toBeFalsy();
		var invalidData = {
			'FrontPage' : {
				'title': 'invalid page',
				'content': 'Invalid',
				'lastUpdateTime': new Date().toISO8601String()
			}
		};
		expect(stocker.isValidData(invalidData)).toBeFalsy();
	});

	it('should be import page that not exist(case 1).', function() {
		try {
			// Prepare test
			var addPage = {
				'name': 'TestAddPage',
				'title': 'Test add page',
				'content': 'Test add page content.',
				'markUpStyle': 'cliwiki'
			};
			stocker.storePage(addPage);
			var serialized = stocker.getSerializedData();
			stocker.deletePage(addPage.name);

			// Test
			stocker.merge(JSON.parse(serialized));

			var merged = stocker.getSerializedData();
			expect(merged).toContain(addPage.name);

			var mergedJson = JSON.parse(merged);
			expect(mergedJson[addPage.name]).not.toBeUndefined();
			expect(mergedJson[addPage.name]).not.toBeNull();
			expect(mergedJson[addPage.name].length).toEqual(1);

			var page = mergedJson[addPage.name][0];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual(addPage.content);
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);
		}
		finally {
			try {
				stocker.deletePage(addPage.name);
			}
			catch (e) {
			}
		}
	});

	it('should be import page that not exist(case 2).', function() {
		try {
			// Prepare test
			var addPage = {
				'name': 'TestAddPage',
				'title': 'Test add page',
				'content': 'Test add page content.',
				'markUpStyle': 'cliwiki'
			};
			stocker.storePage(addPage);

			addPage.content += '(New version)';
			stocker.storePage(addPage);

			var serialized = stocker.getSerializedData();
			stocker.deletePage(addPage.name);

			// Test
			stocker.merge(JSON.parse(serialized));

			var merged = stocker.getSerializedData();
			expect(merged).toContain(addPage.name);

			var mergedJson = JSON.parse(merged);
			expect(mergedJson[addPage.name]).not.toBeUndefined();
			expect(mergedJson[addPage.name]).not.toBeNull();
			expect(mergedJson[addPage.name].length).toEqual(2);

			var page = mergedJson[addPage.name][0];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual(addPage.content);
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);

			page = mergedJson[addPage.name][1];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual('Test add page content.');
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);
		}
		finally {
			try {
				stocker.deletePage(addPage.name);
			}
			catch (e) {
			}
		}
	});

	it('should be merge page history.', function() {
		try {
			// Prepare test
			// Export initial state
			var initial = stocker.getSerializedData();

			// Add new page
			var addPage = {
				'name': 'TestAddPage',
				'title': 'Test add page',
				'content': 'Test add page content(1st).',
				'markUpStyle': 'cliwiki'
			};
			stocker.storePage(addPage);

			// Update add page
			addPage.content = 'Test add page content(2nd).';
			stocker.storePage(addPage);

			// Export current state
			var serializedUpdate1 = stocker.getSerializedData();

			// Remove add page
			stocker.deletePage(addPage.name);

			// Add same page
			addPage.content = 'Test add page content(3rd).';
			stocker.storePage(addPage);

			// Import first updated data
			stocker.merge(JSON.parse(serializedUpdate1));

			// Test
			var merged = stocker.getSerializedData();
			expect(merged).toContain(addPage.name);

			var mergedJson = JSON.parse(merged);
			expect(mergedJson[addPage.name]).not.toBeUndefined();
			expect(mergedJson[addPage.name]).not.toBeNull();
			expect(mergedJson[addPage.name].length).toEqual(3);

			var page = mergedJson[addPage.name][0];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual(addPage.content);
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);

			page = mergedJson[addPage.name][1];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual('Test add page content(2nd).');
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);

			page = mergedJson[addPage.name][2];
			expect(page.title).toEqual(addPage.title);
			expect(page.content).toEqual('Test add page content(1st).');
			expect(page.markUpStyle).toEqual(addPage.markUpStyle);
		}
		finally {
			try {
				stocker.deletePage(addPage.name);
			}
			catch (e) {
			}
		}
	});

	it('should be no change if import a same data.', function() {
		var serialized = stocker.getSerializedData();

		stocker.merge(JSON.parse(serialized));
		var updated = stocker.getSerializedData();
		expect(updated).toEqual(serialized);

		var beforeJson = JSON.parse(serialized);
		var afterJson = JSON.parse(updated);
		var hasOwn = {}.hasOwnProperty;
		for (var pageName in beforeJson) {
			if (hasOwn.call(beforeJson, pageName)) {
				expect(afterJson[pageName]).not.toEqual(null);
			}
		}
	});
});
