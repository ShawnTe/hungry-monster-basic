var Konva = require('konva');
var GameSetUp = require('./game');
var NumberElement = require('./numbers');


var screenObj = window.screen;
var width = window.innerWidth;
var height = screenObj.availHeight - 100;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();

var group = new Konva.Group({
  x: 50,
  y: 50,
  fill : 'Yellow',
  width: width/4,
  height: height/4
});

var text = new Konva.Text({
  x: 50,
  y: 5,
  text: 'Hungry Monster! Drag 2 numbers to equal monster\'s number',
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

var rect = new Konva.Rect({
   x: 20,
   y: 0,
   height: text.getHeight() + 14,
   width: text.getWidth() + 50
  //  stroke: '#555',
  //  strokeWidth: 5,
   // fill: 'BurlyWood',
   // width: stage.getWidth() - 20,
  //  shadowColor: 'black',
  //  shadowBlur: 10,
  //  shadowOffset: [10, 10],
  //  shadowOpacity: 0.2,
  //  cornerRadius: 10
})

layer.add(rect)
layer.add(text)
var tempArray = []

stage.add(layer);

var tempLayer = new Konva.Layer();
stage.add(tempLayer);


const init = () => {
  // playGame(stage);
  game = new GameSetUp.Game(7);
  // debugger
  GameSetUp.assignNumbers(game);
  // debugger
  GameSetUp.drawNumbers(game, layer);
  GameSetUp.assignTarget(game);
  GameSetUp.drawTarget(game, group, layer, stage);

  // drawTarget();
  layer.draw();
}

// const drawNumbers = (game) => {
//   let gameNumbers = game.numbers
//   // var number;
//   var colors = ["FireBrick", "maroon", "goldenrod", "magenta", "Peru", "purple"];
//   for(var i = 0; i < gameNumbers.length; i++) {
//     let gameNum = gameNumbers[i];
//     var number = new Konva.Text({
//       x : gameNum.x,
//       y : gameNum.y,
//       name : 'Current number',
//       text : gameNum.value,
//       fontSize : 80,
//       fontFamily : 'Futura',
//       fill : colors[i],
//       padding : 10,
//       // MAKE SHADOW WHITE OR SOMETHING TO STAND OUT ON MONSTER
//       shadowOffsetX : 5,
//       shadowOffsetY : 5,
//       draggable: true,
//     });
//     layer.add(number);
//   }
// }

// const drawTarget = () => {
//   var name = game.target
//   var imageObj = new Image();
//   imageObj.onload = function() {
//     var monster = new Konva.Image({
//       x: 0,
//       y: 150,
//       image: imageObj,
//       width: 406,
//       height: 418,
//       padding: 10,
//       id : 'target-monster'
//     });
//     group.add(monster);
//
//     var tooltip = new Konva.Label({
//       x: 200,
//       y: 160,
//       opacity: 0.75
//     });
//
//     tooltip.add(new Konva.Tag({
//         name : 'Target',
//         fill: 'gold',
//         pointerDirection: 'down',
//         pointerWidth: 20,
//         pointerHeight: 30,
//         lineJoin: 'round',
//         shadowColor: 'black',
//         shadowBlur: 10,
//         shadowOffset: 10,
//         shadowOpacity: 0.5
//     }));
//     tooltip.add(new Konva.Text({
//         text: name,
//         fontFamily: 'Futura',
//         fontSize: 75,
//         padding: 15,
//         fill: 'white'
//     }));
//
//     var expressionText = new Konva.Text({
//       x: 130,
//       y: 570,
//       text: "____ + ____",
//       fontFamily : 'Futura',
//       fill : 'DarkSlateGray',
//       // shadowColor: 'white',
//       // shadowBlur: 2,
//       // shadowOffsetX : 5,
//       // shadowOffsetY : 5,
//       // shadowOpacity: 0.2,
//       align: 'center',
//       fontSize : 30
//     });
//
//     group.add(expressionText);
//     group.add(tooltip);
//     layer.add(group);
//     stage.add(layer);
//   };
//
//   imageObj.src = './src/images/blue-monster-510w.png';
//
// }

/// how to hold this until onload?

document.getElementById("container").addEventListener("click", holdUntilLoad());

function holdUntilLoad()  {
  stage.on("dragstart", function(e){
    console.log("This is the picked up number: " + e.target.text())
    // IF DRAG PICKKUP IS TARGET, THEN DISREGARD
    e.target.moveTo(tempLayer);
    text.text("");
    layer.draw();
  });
  var previousShape;
  var equationNumber;
  stage.on("dragmove", function(evt){
      var pos = stage.getPointerPosition();
      var shape = layer.getIntersection(pos);
      if (previousShape && shape) {
          if (previousShape !== shape) {
              // leave from old targer
              previousShape.fire('dragleave', {
                  type : 'dragleave',
                  target : previousShape,
                  evt : evt.evt
              }, true);
              // enter new targer
              shape.fire('dragenter', {
                  type : 'dragenter',
                  target : shape,
                  evt : evt.evt
              }, true);
              previousShape = shape;
          } else {
              previousShape.fire('dragover', {
                  type : 'dragover',
                  target : previousShape,
                  evt : evt.evt
              }, true);
          }
      } else if (!previousShape && shape) {
          previousShape = shape;
          shape.fire('dragenter', {
              type : 'dragenter',
              target : shape,
              evt : evt.evt
          }, true);
      } else if (previousShape && !shape) {
          previousShape.fire('dragleave', {
              type : 'dragleave',
              target : previousShape,
              evt : evt.evt
          }, true);
          previousShape = undefined;
      }
  });
  stage.on("dragend", function(e){
      var pos = stage.getPointerPosition();
      var shape = layer.getIntersection(pos);
      // console.log("e", e.target.partialText);
      if (shape) {
          previousShape.fire('drop', {
              type : 'drop',
              target : previousShape,
              evt : e.evt
          }, true);
      }
      previousShape = undefined;
      e.target.moveTo(layer);
      layer.draw();
      tempLayer.draw();
  });
  stage.on("dragenter", function(e){
    if (e.target.attrs.id == "target-monster") {
      e.target.fill('LemonChiffon');
    }

      layer.draw();
  });
  stage.on("dragleave", function(e){
      layer.draw();
      if (e.target.attrs.id == "target-monster") {
        e.target.fill('MediumAquaMarine');
      }

      if (e.target.attrs.id == "target-monster") {
        let num = parseInt(this.tapStartShape.partialText);

        if (tempArray.includes(num)){
          removeNumberFromArray(num);
          checkForCorrectMath();
        }
      };
  });
  stage.on("dragover", function(e){
      // text.text('dragover ');
      // console.log('dragover ' + e.target.name());
      // console.log(e.currentTarget.tapStartShape.parseText)

      layer.draw();
  });
  stage.on("drop", function(e){
    if (e.target.attrs.id === "target-monster"){

      equationNumber = parseInt(e.currentTarget.tapStartShape.text());

      tempArray.push(equationNumber);
      // expressionText.text = equationNumber
      text.text("You added: " + equationNumber)
      checkForCorrectMath();
      console.log(tempArray);
    }
    if (e.target.attrs.id == "target-monster") {
        e.target.fill('MediumAquaMarine');
    }
    layer.draw();
  });
}

const addNumbers = () => {
  var numbersToAdd = []

  for (var i = 0; i < tempArray.length; i++) {
    numbersToAdd.push(parseInt(tempArray[i]));
  }
  var sum = numbersToAdd.reduce((a,b) => a+b, 0);
  return sum
};
const checkForCorrectMath = () => {
  sum = addNumbers();
  if (game.target === sum) {
    youWin();
  } else {
    var answer = ""
    if (sum < game.target) {
      answer = 'low'
    } else {
      answer = 'high'
    }
    tryAgain(answer);
  }
}

const youWin = () => {
  // DELAY 1000 MSEC
  document.getElementById('full-screen').innerHTML = "RIGHT ON! <br /><img src='./src/images/celebrate.gif' width='400' /><br />";
  document.getElementById('full-screen').setAttribute('class', 'success');
  document.getElementById('play-button').classList.remove('hidden');
}

const tryAgain = (answer) => {
  console.log(answer)
  if (answer == 'low') {
    text.text("I'm still hungry!");
  } else {
    text.text("I'm too full!");
  }
}

const removeNumberFromArray = (num) => {
  let index = tempArray.indexOf(num)
  tempArray.splice(index, 1);
};

generateRandomNumber = function(max, min) {
  randomNumber = Math.floor( (Math.random() * (max - min) + min) )
  return randomNumber
}
init();
