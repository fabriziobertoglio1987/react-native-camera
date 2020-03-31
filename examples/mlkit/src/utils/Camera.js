import React, { useCallback } from 'react';
import { RNCamera } from 'react-native-camera';
import { useDimensions } from '@react-native-community/hooks';
import { PERMISSIONS } from './constants';
import { getFramingRect } from './Rectangle';

const Camera = () => {
  const dimensions = useDimensions();
  const onBarCodeRead = useCallback(result => {
    if (result) {
      const { type, data } = result;
      if (data) {
        console.log('code', data);
      }
    }
  }, []);
  return (
    <RNCamera
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}
      rectOfInterest={getFramingRect(dimensions.screen)}
      androidCameraPermissionOptions={PERMISSIONS}
      style={{ height: dimensions.screen.height }}
      type={RNCamera.Constants.Type.back}
    />
  );
};

export default Camera;
