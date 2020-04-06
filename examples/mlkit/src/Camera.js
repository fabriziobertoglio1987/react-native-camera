import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useDeviceOrientation } from '@react-native-community/hooks'
import { RNCamera } from 'react-native-camera';
import { PERMISSIONS } from './utils/constants';
import { getRectangle, emptyRectangle, getFrameDimensions, getFrameStyle } from './utils/rectangle';

function Camera () {
  var cameraRef = useRef(null);
  const dimensions = useDimensions();
  const screen = dimensions.screen;
  const window = dimensions.window;
  const [rectangle, setRectangle] = useState(emptyRectangle);
  const [resolutions, setResolutions] = useState(null);
  const [frameStyle, setFrameStyle] = useState(null);

  const onBarCodeRead = useCallback(result => {
    if (result) {
      const { type, data } = result;
      if (data) {
        console.log('code', data);
      }
    }
  });

  useEffect(() => {
    if(resolutions) {
      const rectangle = getRectangle(resolutions.preview, screen);
      const frameDimensions = getFrameDimensions(rectangle, screen);
      const frameStyle = getFrameStyle(frameDimensions);
      setRectangle(rectangle);
      setFrameStyle(frameStyle);
    }
  }, [screen])

  onCameraReady = async () => {
    const resolutions = await cameraRef.getCameraSettings();
    const rectangle = getRectangle(resolutions.preview, screen);
    const frameDimensions = getFrameDimensions(rectangle, screen);
    const frameStyle = getFrameStyle(frameDimensions);
    setResolutions(resolutions);
    setRectangle(rectangle);
    setFrameStyle(frameStyle);
  }

  return (
    <RNCamera
      ref={ref => { cameraRef = ref; }}
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}
      androidCameraPermissionOptions={PERMISSIONS}
      style={{ height: screen.height }}
      type={RNCamera.Constants.Type.back}
      onCameraReady={onCameraReady}
      planarLuminanceSourceParams={rectangle}>
      <View style={frameStyle} />
    </RNCamera>
  );
};

export default Camera;

