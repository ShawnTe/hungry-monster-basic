var NumberElement = (function () {

  return {
    maxSum: 15,
    Number: function() {
      this.value = generateRandomNumber(NumberElement.maxSum, 1)
      this.text = this.value
      // SHOULD THESE BE IN HERE? OR IN THE KONVA NUMBER FUNCTION????
      this.x = generateRandomNumber(900,500)
      // console.log(this.x)
      this.y = generateRandomNumber(500,80)
      // console.log(this.y)
    }
  }
})();

module.exports = NumberElement;
