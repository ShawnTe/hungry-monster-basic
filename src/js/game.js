var NumberElement = require('./numbers');
// var numbers = require('./numbers')

var GameSetUp = (function () {
  return {
    numOfNumberElements: 7,
    Game: function(numOfNumbers) {
      this.numberOfTurns = 3,
      this.over = false,
      this.target = 0,
      this.numOfNumbers = 0,
      this.numbers = []
    },
    assignNumbers: function(game) {
       for (var i = 0; i < GameSetUp.numOfNumberElements; i++) {
         var num = new NumberElement.Number()
         if (game.numbers.length === 0) {
           game.numbers.push(num)
         } else {
           var newNum = GameSetUp.detectOverlap(game, num);
           game.numbers.push(newNum)
         }
       }
       console.log("In assignNumbers", game.numbers)
       return game;
     },
     detectOverlap: function(game, num) {
         for (var i = 0; i < game.numbers.length; i++){
           let numInArray = game.numbers[i]
           let dx = Math.abs(numInArray.x - num.x);
           let dy = Math.abs(numInArray.y - num.y);

             if (dx < 50 && dy < 50) {
               num = new NumberElement.Number()
               GameSetUp.detectOverlap(game, num)
             };
         };
         return num;
     },
    assignTarget: function(game) {
      let numOfObjects = game.numbers.length
      let i = generateRandomNumber(numOfObjects-1,1)
      let j = i - 1
      let actualNumValue1 = game.numbers[i].value
      let actualNumValue2 = game.numbers[j].value

      game.target = actualNumValue1 + actualNumValue2
    }
  }
})();

// var gameSetUp = {
  // Game: function() {
  //   this.numberOfTurns = 3,
  //   this.over = false,
  //   this.target = 0,
  //   this.numbers = []
  // },

  // assignTarget: function(game) {
  //   let numOfObjects = game.numbers.length
  //   let i = generateRandomNumber(numOfObjects-1,1)
  //   let j = i - 1
  //   let actualNumValue1 = game.numbers[i].value
  //   let actualNumValue2 = game.numbers[j].value
  //
  //   game.target = actualNumValue1 + actualNumValue2
  // },
// }

module.exports = GameSetUp;
