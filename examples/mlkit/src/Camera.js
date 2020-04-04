import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Button } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useDeviceOrientation } from '@react-native-community/hooks'
import { RNCamera } from 'react-native-camera';
import Frame from './Frame';
import { PERMISSIONS } from './utils/constants';
import { getRect, emptyRect } from './utils/rectangle';

function Camera () {
  var cameraRef = useRef(null);
  const screen = useDimensions().screen;
  // const orientation = useDeviceOrientation();
  const [rectOfInterest, setRectOfInterest] = useState(emptyRect);
  const [resolutions, setResolutions] = useState(null);

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
      const rectOfInterest = getRect(resolutions.preview, screen);
      setRectOfInterest(rectOfInterest);
      console.log('rectOfInterest', rectOfInterest);
    }
  }, [screen])

  onCameraReady = async () => {
    const resolutions = await cameraRef.getCameraSettings();
    const rectOfInterest = getRect(resolutions.preview, screen);
    console.log('rectOfInterest', rectOfInterest);
    setResolutions(resolutions);
    setRectOfInterest(rectOfInterest);
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
      rectOfInterest={rectOfInterest}>
      {/*
      <Frame 
        rect={rectOfInterest} 
        screen={screen}/>
      */}
    </RNCamera>
  );
};

export default Camera;
