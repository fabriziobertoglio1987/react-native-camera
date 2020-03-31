export function getFramingRect(screen) {
  const HEIGHT = 240;
  const WIDTH = 240;
  const leftOffset = (screen.width - WIDTH) / 2;
  const topOffset = (screen.height - HEIGHT) / 2;

  // return {
  //   x: leftOffset,
  //   y: topOffset,
  //   width: leftOffset + WIDTH,
  //   height: topOffset + HEIGHT,
  //   landscapeMode: ?,
  // };
  return {
    x: 500,
    y: 192,
    width: 500,
    height: 400,
    landscapeMode: false,
  };
};
