var GameSetUp = (function () {
  return {
    numOfNumberElements: 8,
    maxNum: 14,
    width: window.innerWidth,
    height: window.screen.availHeight - 115,
    sizeAdjust: function(large,small) {
      let size = 0

      if(GameSetUp.width < 700) size = small
      else size = large

      return size
    },
    Game: function(numOfNumbers) {
      this.target = 0,
      this.numOfNumbers = numOfNumbers,
      this.numbers = []
    },
    Number: function() {
      this.value = generateRandomNumber(GameSetUp.maxNum, 1)
      this.text = this.value
      // SHOULD THESE BE IN HERE? OR IN THE KONVA NUMBER FUNCTION????
      this.x = generateRandomNumber(GameSetUp.width*.83,GameSetUp.width*.4)
      this.y = generateRandomNumber(GameSetUp.height*.8,GameSetUp.height*.1)
    },
    assignNumbers: function(game) {
       for (var i = 0; i < game.numOfNumbers; i++) {
         var num = new GameSetUp.Number()
         if (game.numbers.length === 0) {
           game.numbers.push(num)
         } else {
           var newNum = GameSetUp.detectOverlap(game, num);
           game.numbers.push(newNum)
         }
       }
       // console.log("In assignNumbers", game.numbers)
       return game;
    },
    detectOverlap: function(game, num) {
      for (var i = 0; i < game.numbers.length; i++){
        let numInArray = game.numbers[i]
        let dx = Math.abs(numInArray.x - num.x);
        let dy = Math.abs(numInArray.y - num.y);
        let overlap = GameSetUp.sizeAdjust(70,40);

        if (dx < overlap && dy < overlap) {
          num = new GameSetUp.Number()
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
    drawTarget: function(game, group, layer, stage, targetNumFontSize) {
      var name = game.target
      var imageObj = new Image();
      var targetNumFontSize = targetNumFontSize;
      
      imageObj.onload = function() {
        let monsterX = GameSetUp.sizeAdjust(0,-30)
        let monsterY = GameSetUp.sizeAdjust(stage.getHeight() / 5,0)
        let targetNumX = GameSetUp.sizeAdjust(stage.getWidth() / 9,0)
        let targetNumY = GameSetUp.sizeAdjust(stage.getHeight() / 5,0)

        var monster = new Konva.Image({
          x: monsterX,
          y: monsterY,
          image: imageObj,
          width: stage.getWidth() / 2.5,
          height: stage.getWidth() / 2.5,
          padding: 10,
          id: 'target-monster'
        });
        group.add(monster);

        var tooltip = new Konva.Label({
          x: targetNumX,
          y: targetNumY,
          rotation: -10,
          opacity: 0.75
        });

        tooltip.add(new Konva.Tag({
            name: 'Target',
            fill: 'gold',
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 30,
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: 10,
            opacity: .8,
            shadowOpacity: 0.5
        }));
        tooltip.add(new Konva.Text({
            text: name,
            fontFamily: 'Futura',
            fontSize: targetNumFontSize,
            padding: 15,
            fill: 'white',
            shadowColor: 'DarkSlateGray',
            shadowBlur: 2,
            shadowOffsetX : 5,
            shadowOffsetY : 5,
        }));
        group.add(tooltip);
        layer.add(group);
        stage.add(layer);
      };
      imageObj.src = './src/images/blue-monster-510w.png';
    },
    drawNumbers: function(game, layer, fontSize) {
      let gameNumbers = game.numbers
      var colors = ["FireBrick", "maroon", "goldenrod", "magenta", "Peru", "purple"];
      for(var i = 0; i < gameNumbers.length; i++) {
        let gameNum = gameNumbers[i];
        var number = new Konva.Text({
          x : gameNum.x,
          y : gameNum.y,
          name : 'Current number',
          text : gameNum.value,
          fontSize : fontSize,
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
    },
    chooseRandomMessage: function(messageType) {

    }
  }

})();


module.exports = GameSetUp;
