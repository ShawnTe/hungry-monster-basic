var Konva = require('konva');
var GameSetUp = require('./gameSetUp');
// import { SuccessMessages } from '../data/messages'


var screenObj = window.screen;
var width = window.innerWidth *.95;
var height = window.innerHeight *.95;

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

let titleFontSize = GameSetUp.sizeAdjust(30,16)
let titleTextX = GameSetUp.sizeAdjust(50,100)
let titleTextY = GameSetUp.sizeAdjust(5,16)

var text = new Konva.Text({
  x: titleTextX,
  y: titleTextY,
  text: 'Hungry Monster! Drag 2 numbers to equal monster\'s number',
  fontFamily: 'Futura',
  fill: 'DarkSlateGray',
  shadowColor: 'white',
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  align: 'center',
  fontSize: titleFontSize
});

let numbersAddedFontSize = GameSetUp.sizeAdjust(30,20)

var youAddedNumbers = new Konva.Text({
  x: width * .13,
  y: height * .85,
  fontFamily : 'Futura',
  fill : 'DarkSlateGray',
  shadowColor: 'white',
  shadowBlur: 2,
  shadowOpacity: 0.2,
  align: 'center',
  fontSize : numbersAddedFontSize
});

var tempArray = []
var tempLayer = new Konva.Layer();
layer.add(youAddedNumbers);
layer.add(text);
stage.add(layer);
stage.add(tempLayer);

let numberFontSize = GameSetUp.sizeAdjust(80,40)
let targetNumFontSize = GameSetUp.sizeAdjust(70,30)

const init = () => {
  game = new GameSetUp.Game(7);

  GameSetUp.assignNumbers(game);
  GameSetUp.drawNumbers(game, layer, numberFontSize);
  GameSetUp.assignTarget  (game);
  GameSetUp.drawTarget(game, group, layer, stage, targetNumFontSize);

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
              // enter new target
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
    if (e.currentTarget.pointerPos.x > 50 && e.currentTarget.pointerPos.x < 440) {
      equationNumber = parseInt(e.currentTarget.tapStartShape.text());

      tempArray.push(equationNumber);
      checkForCorrectMath();
      showNumbers();

      e.target.fill('MediumAquaMarine');
    // snap current number to new position for esy viewing
      // if (e.target.attrs.id === "target-monster"){
      // console.log('monster target: ', e.target.attrs)
      // let currNumber = e.currentTarget.tapStartShape
      // console.log('number: ', e.currentTarget.tapStartShape.attrs)
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

let successMessages = [
  "Right on, Turkey Feathers!",
  "Huzzah Fo-Fizzah!",
  "WooHoo Shmoodo!",
  "Hot Diggity Doggie!",
  "Booya, Baby!",
  "Bodacious!",
  "Fantastilicious!",
  "Fantastico Bombastico!",
  "Rock on, Sugar Cakes!",
  "Razzle Dazzle!",
  "Kaboom Kaboomie",
  "Hooray Hurrah!",
  "Honky Dora-licious",
  "Fantastico!"
];

const getMessage = function(list) {
  let highestIndex = list.length
  let messageIndex = generateRandomNumber(highestIndex,lowestIndex=0)

  return list[messageIndex]
}
const youWin = () => {
  function successMessage() {
    document.getElementById('container').innerHTML = `${getMessage(successMessages)} <br /><img src='./src/images/celebrate.gif' width=${stage.getWidth()/2} id="success-image" /><br />`;
    document.getElementById('full-screen').setAttribute('class', 'success');
    document.getElementById('play-button').classList.remove('hidden');
  }
  setTimeout(successMessage, 500)
}

let tooLowMessages = [
  "I'm still hungry!",
  "More, please!",
  "More more more!",
  "Another bite!",
  "Give me another!"
]

let tooHighMessages = [
  "I'm too full!",
  "Ugh, no more!",
  "I have a belly ache!",
  "Burp. Too much!",
  "Less, please.",
  "Not So Much!",
  "I can't eat so much"
]

const tryAgain = (answer) => {
  let feedbackFontSize = GameSetUp.sizeAdjust(50,20)
  let feedbackTextX = GameSetUp.sizeAdjust(400,stage.getWidth()/2)
  let feedbackTextY = GameSetUp.sizeAdjust(20,16)

  text.x(feedbackTextX);
  text.y(feedbackTextY);
  text.fontSize(feedbackFontSize);
  if (answer == 'low') {
    text.text(`${getMessage(tooLowMessages)}`);
  } else {
    text.text(`${getMessage(tooHighMessages)}`);
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
