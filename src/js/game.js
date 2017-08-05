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

        if (dx < 70 && dy < 70) {
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
    },
    drawTarget: function(game, group, layer, stage) {
      var name = game.target
      var imageObj = new Image();
      imageObj.onload = function() {
        var monster = new Konva.Image({
          x: 0,
          y: 150,
          image: imageObj,
          width: 406,
          height: 418,
          padding: 10,
          id : 'target-monster'
        });
        group.add(monster);

        var tooltip = new Konva.Label({
          x: 200,
          y: 160,
          opacity: 0.75
        });

        tooltip.add(new Konva.Tag({
            name : 'Target',
            fill: 'gold',
            pointerDirection: 'down',
            pointerWidth: 20,
            pointerHeight: 30,
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: 10,
            shadowOpacity: 0.5
        }));
        tooltip.add(new Konva.Text({
            text: name,
            fontFamily: 'Futura',
            fontSize: 75,
            padding: 15,
            fill: 'white'
        }));

        var expressionText = new Konva.Text({
          x: 130,
          y: 570,
          // text: "____ + ____",
          fontFamily : 'Futura',
          fill : 'DarkSlateGray',
          // shadowColor: 'white',
          // shadowBlur: 2,
          // shadowOffsetX : 5,
          // shadowOffsetY : 5,
          // shadowOpacity: 0.2,
          align: 'center',
          fontSize : 30
        });

        group.add(expressionText);
        group.add(tooltip);
        layer.add(group);
        stage.add(layer);
      };
      imageObj.src = './src/images/blue-monster-510w.png';
    },
    drawNumbers: function(game, layer) {
      let gameNumbers = game.numbers
      var colors = ["FireBrick", "maroon", "goldenrod", "magenta", "Peru", "purple"];
      for(var i = 0; i < gameNumbers.length; i++) {
        let gameNum = gameNumbers[i];
        var number = new Konva.Text({
          x : gameNum.x,
          y : gameNum.y,
          name : 'Current number',
          text : gameNum.value,
          fontSize : 80,
          fontFamily : 'Futura',
          fill : colors[i],
          padding : 10,
          shadowColor: 'white',
          shadowOffsetX : 4,
          shadowOffsetY : 4,
          draggable: true,
        });
        layer.add(number);
      }
    }
  }

})();


module.exports = GameSetUp;
