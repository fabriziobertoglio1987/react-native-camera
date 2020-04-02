const getRect = function(preview) {
  const WIDTH = 800;
  const HEIGHT = 400;
  const left = (preview.width - WIDTH) / 2;
  const top = (preview.height - HEIGHT) / 2;
  return {
    dataWidth: preview.width,
    dataHeight: preview.height,
    left,
    top,
    width: WIDTH,
    height: HEIGHT,
  };
}

const emptyRect = {
  dataWidth: 0, 
  dataHeight: 0, 
  left: 0, 
  top: 0, 
  width: 0, 
  height: 0
}

const getFrameDimensions = function(screen, rect) {
  const isEmpty = rect === emptyRect
  if (isEmpty) { return emptyFrame; };
  const heightToPixel = screen.height / rect.dataWidth;    
  const widthToPixel = screen.width / rect.dataHeight;
  return {
    top: rect.top * heightToPixel,
    left: rect.left * widthToPixel,
    height: rect.width * widthToPixel,
    width: rect.height * heightToPixel,
  }
}

const emptyFrame = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

export { getRect, emptyRect, getFrameDimensions };
