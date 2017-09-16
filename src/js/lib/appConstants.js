export const SCREENOBJ = window.screen;
export const WIDTH = window.innerWidth;
export const HEIGHT = SCREENOBJ.availHeight - 115.;

export const GENERATE_RANDOM_NUMBER = function(max, min) {
  randomNumber = Math.floor( (Math.random() * (max - min) + min) )
  return randomNumber
}