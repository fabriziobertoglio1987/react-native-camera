import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getFrameDimensions } from './utils/rectangle';
 
function Frame({ rect, window}) {
  const position = getFrameDimensions(rect, window);
  const style = {
    position: 'absolute',
    left: position.left,
    top: position.top,
    width: position.width,
    height: position.height,
    borderWidth: 7,
    borderColor: 'red',
    opacity: 0.5
  };
  return <View style={style} />;
}

export default Frame;
