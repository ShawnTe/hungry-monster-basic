


/////////////////////////////////////////
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
    fontSize : 30
  });

  var rect = new Konva.Rect({
    x: 0,
     y: 0,
    //  stroke: '#555',
    //  strokeWidth: 5,
     fill: 'BurlyWood',
     width: stage.getWidth() - 70,
     height: text.getHeight() + 10

    //  shadowColor: 'black',
    //  shadowBlur: 10,
    //  shadowOffset: [10, 10],
    //  shadowOpacity: 0.2,
    //  cornerRadius: 10
  })

  layer.add(rect)
  layer.add(text)   //??
  var tempArray = []


  stage.add(layer);

  var tempLayer = new Konva.Layer();
  stage.add(tempLayer);


const init = () => {
  // playGame(stage);
  game = new Game();
  assignNumbers();
  drawNumbers();
  assignTarget();
  drawTarget();
  layer.draw();
}

const drawNumbers = () => {
  let gameNumbers = game.numbers
  // var number;
  var colors = ["FireBrick", "maroon", "goldenrod", "magenta", "Peru", "purple"];
  for(var i = 0; i < gameNumbers.length; i++) {
    let gameNum = gameNumbers[i];
    var number = new Konva.Text({
      x : gameNum.x,
      y : gameNum.y,
      // x : generateRandomNumber(stage.getWidth() - 200) + 100,
      // y : generateRandomNumber(stage.getHeight() -200) + 100,
      // name : gameNum.name,
      name : 'Current number',
      text : gameNum.value,
      fontSize : 80,
      fontFamily : 'Futura',
      fill : colors[i],
      padding : 10,
      shadowOffsetX : 5,
      shadowOffsetY : 5,
      draggable: true,
    });
    layer.add(number);
  }
}

const drawTarget = () => {
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

    group.add(tooltip);
    layer.add(group);
    stage.add(layer);
  };

  imageObj.src = './images/blue-monster-510w.png';

}

/// how to hold this until onload?

document.getElementById("container").addEventListener("click", holdUntilLoad());

function holdUntilLoad()  {
  stage.on("dragstart", function(e){
    console.log("This is the picked up number: " + e.target.text())

    e.target.moveTo(tempLayer);
    // console.log('Moving ' + e.target.name());
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
      e.target.fill('LemonChiffon');
      // text.text('dragenter ' + e.target.name());
      layer.draw();
  });
  stage.on("dragleave", function(e){
      // e.target.fill('blue');
      // text.text('dragleave ' + e.target.name());
      layer.draw();
      if (e.target.name() == "Target") {
        console.log('SAY YESSSSS ' )
        // console.log(this )
        // if # is in tempArray, then delete
        let num = parseInt(this.tapStartShape.partialText);
        // console.log(parseInt(num))
        console.log('tempArray: ')
        console.log(tempArray);
        var whazza = tempArray.includes(num)
        console.log(whazza)
        if (tempArray.includes(num)){
          let index = tempArray.indexOf(num)
            tempArray.splice(index, 1);
        } else {
          console.log('tempArray.includes is FALSE')
        }
        console.log(tempArray)
      };
  });
  stage.on("dragover", function(e){
      // text.text('dragover ');
      // console.log('dragover ' + e.target.name());
      // console.log(e.currentTarget.tapStartShape.parseText)

      layer.draw();
  });
  stage.on("drop", function(e){
    // console.log(e)
      if (e.target.attrs.id === "target-monster"){

        equationNumber = parseInt(e.currentTarget.tapStartShape.text());

        tempArray.push(equationNumber);
        checkForCorrectMath();
        console.log(tempArray);
      } else { };
      e.target.fill('MediumAquaMarine');
      layer.draw();
  });
}

init();
