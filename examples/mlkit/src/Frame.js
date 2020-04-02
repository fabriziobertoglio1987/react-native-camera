import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { getFrameDimensions } from './utils/rectangle';
 
function Frame({ rect }) {
  const screen = useDimensions().screen;
  const position = getFrameDimensions(screen, rect);
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
