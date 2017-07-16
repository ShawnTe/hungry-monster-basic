var number = {
  numOfNumbers: 7,
  generateRandomNumber: function(max, min) {
    randomNumber = Math.floor( (Math.random() * (max - min) + min) )
    return randomNumber
  },
  Number: function() {
    this.value = number.generateRandomNumber(10, 1)
    this.text = this.value
    // SHOULD THESE BE IN HERE? OR IN THE KONVA NUMBER FUNCTION????
    this.x = number.generateRandomNumber(900,500)
    // console.log(this.x)
    this.y = number.generateRandomNumber(600,100)
    // console.log(this.y)
  },
 assignNumbers: function(game) {
    for (var i = 0; i < number.numOfNumbers; i++) {
      var num = new number.Number()

      if (game.numbers.length < 1) {
        game.numbers.push(num)
      } else {
        var newNum = number.detectOverlap(game, num);
        game.numbers.push(newNum)
      }
    }
    console.log(game.numbers)
    return game;
  },
  detectOverlap: function(game, num) {
    while (true) {
      for (var i = 1; i < game.numbers.length; i++){
        let numInArray = game.numbers[i]
        let dx = Math.abs(numInArray.x - num.x);
        let dy = Math.abs(numInArray.y - num.y);

          if (dx > 80 && dy > 80) {
            return num;
          } else {
            let num = new number.Number()
            number.detectOverlap(game, num)
          };
          return false;
      };
      return num;
    }
  }
}

module.exports = number;
