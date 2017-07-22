var NumberElement = (function () {

  return {
    Number: function() {
      this.value = generateRandomNumber(10, 1)
      this.text = this.value
      // SHOULD THESE BE IN HERE? OR IN THE KONVA NUMBER FUNCTION????
      this.x = generateRandomNumber(900,500)
      // console.log(this.x)
      this.y = generateRandomNumber(600,100)
      // console.log(this.y)
    }
  }
})();


// var number = {
  // numOfNumbers: 7,  // moved to GameSetUp
  // generateRandomNumber: function(max, min) {
  //   randomNumber = Math.floor( (Math.random() * (max - min) + min) )
  //   return randomNumber
  // },
//   Number: function() {
//     this.value = generateRandomNumber(10, 1)
//     this.text = this.value
//     // SHOULD THESE BE IN HERE? OR IN THE KONVA NUMBER FUNCTION????
//     this.x = generateRandomNumber(900,500)
//     // console.log(this.x)
//     this.y = generateRandomNumber(600,100)
//     // console.log(this.y)
//   },
//  assignNumbers: function(game) {
//     for (var i = 0; i < game.numOfNumbers; i++) {
//       var num = new number.Number()
//       if (game.numbers.length === 0) {
//         game.numbers.push(num)
//       } else {
//         var newNum = number.detectOverlap(game, num);
//         game.numbers.push(newNum)
//       }
//     }
//     console.log(game.numbers)
//     return game;
//   },
//   detectOverlap: function(game, num) {
//       for (var i = 0; i < game.numbers.length; i++){
//         let numInArray = game.numbers[i]
//         let dx = Math.abs(numInArray.x - num.x);
//         let dy = Math.abs(numInArray.y - num.y);
//
//           if (dx < 2 || dy < 2) {
//             num = new number.Number()
//             number.detectOverlap(game, num)
//           };
//       };
//       return num;
//   }
// }
//
module.exports = NumberElement;
