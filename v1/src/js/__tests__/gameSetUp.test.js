var GameSetUp = require('../gameSetUp');

describe('GameSetUp', () => {

	test('Number of Elements', () => {

		expect(GameSetUp.numOfNumberElements).toEqual(8)
	})

	test('sizeAdjust', () => {

		expect(GameSetUp.sizeAdjust(100,50)).toEqual(100)
	})

})


