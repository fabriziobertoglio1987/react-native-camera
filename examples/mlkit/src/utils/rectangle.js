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
    dataWidth: 1440,
    dataHeight: 1080,
    left: 300,
    top: 400,
    width: 800,
    height: 400,
  };
}
