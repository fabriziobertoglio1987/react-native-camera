const getRectangle = function(preview, screen) {
  const landscape = screen.width > screen.height;
  const dataWidth = landscape ? preview.width : preview.height;
  const dataHeight = landscape ? preview.height : preview.width;
  const WIDTH = landscape ? 600 : 800;
  const HEIGHT = landscape ? 600 : 500;
  const left = (dataWidth - WIDTH) / 2;
  const top = (dataHeight - HEIGHT) / 2;
  return {
    dataWidth,
    dataHeight,
    left,
    top,
    width: WIDTH,
    height: HEIGHT
  }
}

const emptyRectangle = {
  dataWidth: 0, 
  dataHeight: 0, 
  left: 0, 
  top: 0, 
  width: 0, 
  height: 0
}

const getFrameDimensions = function(rect, window) {
  const isEmpty = rect === emptyRectangle;
  if (isEmpty) { return emptyFrame; };
  const landscape = window.width > window.height;
  const heightToPixel = window.height / rect.dataHeight;    
  const widthToPixel = window.width / rect.dataWidth;
  const top = rect.top * heightToPixel;
  const left = rect.left * widthToPixel;
  const width = rect.width * widthToPixel;
  const height = rect.height * heightToPixel;
  return {
    left,
    top,
    width,
    height
  }
}

const getFrameStyle = function(position) {
  return {
    position: 'absolute',
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
    borderWidth: 7,
    borderColor: 'red',
    opacity: 0.5
  };
};

const emptyFrame = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

export { getRectangle, emptyRectangle, getFrameDimensions, getFrameStyle };
