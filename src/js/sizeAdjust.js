const sizeAdjust = function(large,small) {
  let size = 0

  if(window.innerWidth < 700) size = small
  else size = large

  return size
}

module.exports = sizeAdjust