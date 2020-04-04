const getRect = function(preview, screen) {
  const landscape = screen.width > screen.height;
  const dataWidth = landscape ? preview.width : preview.height;
  const dataHeight = landscape ? preview.height : preview.width;
  const WIDTH = landscape ? 800 : 400;
  const HEIGHT = landscape ? 400 : 800;
  const left = (dataWidth - WIDTH) / 2;
  const top = (dataHeight - HEIGHT) / 2;
  if(landscape) { 
    return {
      dataWidth: 1440,
      dataHeight: 1080,
      left: 266,
      top: 192,
      width: 666,
      height: 533
    }
    //    return {
    //      dataWidth,
    //      dataHeight,
    //      left,
    //      top,
    //      width: WIDTH,
    //      height: HEIGHT,
    //    };
  } else {
    return {
      dataWidth: 1080,
      dataHeight: 1440,
      left: 500,
      top: 100,
      width: 600,
      height: 900
    }
  }
}

const emptyRect = {
  dataWidth: 0, 
  dataHeight: 0, 
  left: 0, 
  top: 0, 
  width: 0, 
  height: 0
}

const getFrameDimensions = function(rect, screen) {
  const isEmpty = rect === emptyRect
  if (isEmpty) { return emptyFrame; };
  const landscape = screen.width > screen.height;
  const heightToPixel = screen.height / rect.dataHeight;    
  const widthToPixel = screen.width / rect.dataWidth;
  const top = rect.top * heightToPixel;
  const left = rect.left * widthToPixel;
  const width = rect.width * widthToPixel;
  const height = rect.height * heightToPixel;
  if(landscape) {
    return {
      top,
      left,
      width,
      height
    }
  } else {
    return {
      top: left,
      left: top,
      width: height,
      height: width,
    }
  }
}

const emptyFrame = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

export { getRect, emptyRect, getFrameDimensions };
