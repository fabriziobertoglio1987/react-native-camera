import React, { useCallback, useRef, useState } from 'react';
import { Button } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { RNCamera } from 'react-native-camera';
import Frame from './Frame';
import { PERMISSIONS } from './utils/constants';
import { getRect, emptyRect } from './utils/rectangle';

function Camera () {
  var cameraRef = useRef(null);
  const dimensions = useDimensions();
  const [rectOfInterest, setRectOfInterest] = useState(emptyRect);

  const onBarCodeRead = useCallback(result => {
    if (result) {
      const { type, data } = result;
      if (data) {
        console.log('code', data);
      }
    }
  }, []);

  onCameraReady = async () => {
    const resolutions = await cameraRef.getCameraSettings();
    const rectOfInterest = getRect(resolutions.preview);
    setRectOfInterest(rectOfInterest);
  }

  return (
    <RNCamera
      ref={ref => { cameraRef = ref; }}
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}
      androidCameraPermissionOptions={PERMISSIONS}
      style={{ height: dimensions.screen.height }}
      type={RNCamera.Constants.Type.back}
      onCameraReady={onCameraReady}
      rectOfInterest={rectOfInterest}>
      <Frame rect={rectOfInterest} />
    </RNCamera>
  );
};

export default Camera;
