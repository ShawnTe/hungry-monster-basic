var GameSetUp = require('../gameSetUp');
// can also use test.only

test('Minimum Number of Elements', () => {
	expect(GameSetUp.numOfNumberElements).toBeGreaterThanOrEqual(5)
})

test.skip('sizeAdjust', () => {

	expect(GameSetUp.sizeAdjust(100,50)).toEqual(100)
})

test.skip('Game', () => {

})

test.skip('Number', () => {

})



