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
  fontFamily: 'Futura',
  fill: 'DarkSlateGray',
  shadowColor: 'white',
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  align: 'center',
  fontSize: 30
});

var youAddedNumbers = new Konva.Text({
  x: 130,
  y: 620,
  // text: "",
  fontFamily : 'Futura',
  fill : 'DarkSlateGray',
  shadowColor: 'white',
  shadowBlur: 2,
  shadowOpacity: 0.2,
  align: 'center',
  fontSize : 30
});

var tempArray = []
var tempLayer = new Konva.Layer();
layer.add(youAddedNumbers);
layer.add(text);
stage.add(layer);
stage.add(tempLayer);


const init = () => {
  game = new GameSetUp.Game(7);

  GameSetUp.assignNumbers(game);
  GameSetUp.drawNumbers(game, layer);
  GameSetUp.assignTarget(game);
  GameSetUp.drawTarget(game, group, layer, stage);

  layer.draw();
}

document.getElementById("container").addEventListener("click", holdUntilLoad());

function holdUntilLoad()  {
  stage.on("dragstart", function(e){
    // console.log("This is the picked up number: " + e.target.text())
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
          showNumbers();
          checkForCorrectMath();
        }
      };
  });
  stage.on("dragover", function(e){
      layer.draw();
  });
  stage.on("drop", function(e){
    if (e.target.attrs.id === "target-monster"){
      equationNumber = parseInt(e.currentTarget.tapStartShape.text());

      tempArray.push(equationNumber);
      checkForCorrectMath();
      showNumbers();
      e.target.fill('MediumAquaMarine');
    }
    layer.draw();
  });
}

const showNumbers = () => { 
  let numbersAdded = ""
    for(var i = 0; i < tempArray.length; i++) {
      if (numbersAdded) {
        numbersAdded += " + " + tempArray[i];
      } else {
        numbersAdded += "You added:  " + tempArray[i];
      }
    }
    youAddedNumbers.setText(numbersAdded);
} 

const addNumbers = () => {
  let numbersToAdd = []

  for (var i = 0; i < tempArray.length; i++) {
    numbersToAdd.push(parseInt(tempArray[i]));
  }
  let sum = numbersToAdd.reduce((a,b) => a+b, 0);
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
  function successMessage() {
    document.getElementById('full-screen').innerHTML = "RIGHT ON! <br /><img src='./src/images/celebrate.gif' width='400' /><br />";
    document.getElementById('full-screen').setAttribute('class', 'success');
    document.getElementById('play-button').classList.remove('hidden');
  }
  setTimeout(successMessage, 500)
}

const tryAgain = (answer) => {
  console.log(answer)
    text.x(380);
    text.y(15);
    text.fontSize(45);
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
