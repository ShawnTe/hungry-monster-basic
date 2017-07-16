var numbers = require('./numbers')

var gameSetUp = {
  Game: function() {
    this.numberOfTurns = 3,
    this.over = false,
    this.target = 0,
    this.numbers = []
  },

  assignTarget: function(game) {
    let numOfObjects = game.numbers.length
    let i = numbers.generateRandomNumber(numOfObjects-1,1)
    let j = i - 1
    let actualNumValue1 = game.numbers[i].value
    let actualNumValue2 = game.numbers[j].value

    game.target = actualNumValue1 + actualNumValue2
  },
}

module.exports = gameSetUp;
