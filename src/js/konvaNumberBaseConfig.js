const sizeAdjust = require('./sizeAdjust')

const konvaNumberBaseConfig = () => {
  const fontSize = sizeAdjust(80, 40)

  return {
    name : 'Current number',
    fontSize : fontSize,
    fontFamily : 'Futura',
    padding : 10,
    shadowColor: 'white',
    shadowOffsetX : 4,
    shadowOffsetY : 4,
    draggable: true,  
  }
}

module.exports = konvaNumberBaseConfig