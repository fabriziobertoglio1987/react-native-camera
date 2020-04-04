# Rectangle Of Interest for Barcode Scanning (Android)
<img src="https://user-images.githubusercontent.com/24992535/78279966-9fddce80-7518-11ea-93b6-0340a217d53a.jpg" alt="alt text" width="400px" height="whatever">

## Calculating Cropping Parameters

```javascript
landscape = {
  dataWidth: 1440,
  dataHeight: 1080,
  left: 250,
  top: 300,
  width: 950,
  height: 600,
}
```
<img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/landscapeWithRuler.png" alt="alt text" width="600px" height="whatever">

```javascript
portrait = {
  dataWidth: 1080,
  dataHeight: 1440,
  left: 500,
  top: 100,
  width: 600,
  height: 900
}
```

<img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/portraitWithRuler.png" alt="alt text" width="600px" height="whatever">

Simple example on how to use the `rectOfInterest` on Android. The current version does not take in consideration the Phone Orientation (will be implemented lated using hook `useDimensions`) and `distorsions`.
[`Camera.js`][10] will retrieve the Image and Preview resolution via the react native brige once `onCameraReady` is triggered.

```javascript
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

```

The [`rectangle.js`][11] file uses the image and preview resolution to calculate the `rectOfInterest` cropping parameters.

```javascript
const getRect = function(preview) {
  const WIDTH = 800;
  const HEIGHT = 400;
  const left = (preview.width - WIDTH) / 2;
  const top = (preview.height - HEIGHT) / 2;
  return {
    dataWidth: preview.width,
    dataHeight: preview.height,
    left,
    top,
    width: WIDTH,
    height: HEIGHT,
  };
}

const emptyRect = {
  dataWidth: 0, 
  dataHeight: 0, 
  left: 0, 
  top: 0, 
  width: 0, 
  height: 0
}

const getFrameDimensions = function(screen, rect) {
  const isEmpty = rect === emptyRect
  if (isEmpty) { return emptyFrame; };
  const heightToPixel = screen.height / rect.dataWidth;    
  const widthToPixel = screen.width / rect.dataHeight;
  return {
    top: rect.top * heightToPixel,
    left: rect.left * widthToPixel,
    height: rect.width * widthToPixel,
    width: rect.height * heightToPixel,
  }
}

const emptyFrame = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

export { getRect, emptyRect, getFrameDimensions };
```

The [`Frame`][12] component displays the `red rectangle` for focusing on the Barcode.
The below more complex example explains how to avoid distorsions.

[10]: https://github.com/fabriziobertoglio1987/react-native-camera/blob/encapsulating-logic-in-area-class/example/examples/mlkit/src/Camera.js
[11]: https://github.com/fabriziobertoglio1987/react-native-camera/blob/encapsulating-logic-in-area-class/example/examples/mlkit/src/utils/rectangle.js
[12]: https://github.com/fabriziobertoglio1987/react-native-camera/blob/encapsulating-logic-in-area-class/example/examples/mlkit/src/Frame.js


## Avoiding Distortions between Image/Camera and Preview Resolution
Based on the [`zxing android`](https://github.com/zxing/zxing/tree/a65631d0b643e778b8b1c1975e4f18f35e401fa4/android) Demo SourceCode I can implement this solution in ReactNative:

1) The method [`getFramingRect()`][2] called from [`buildLuminanceSource()`][3] calculates a [`Reactangle`](https://github.com/zxing/zxing/blob/a65631d0b643e778b8b1c1975e4f18f35e401fa4/android/src/com/google/zxing/client/android/camera/CameraManager.java#L300).
2) The `reactangle` is calculated based on the [screen resolution](https://developer.android.com/reference/android/view/WindowManager#getCurrentWindowMetrics()), [camera resolution][15] and original image `width` and `height`. 
3) [`buildLuminanceSource()`][3] calls [`PlanarYUVLuminanceSource`](https://zxing.github.io/zxing/apidocs/com/google/zxing/PlanarYUVLuminanceSource.html) to crop and scan the image.

[1]: https://play.google.com/store/apps/details?id=com.google.zxing.client.android
[2]: https://github.com/zxing/zxing/blob/a65631d0b643e778b8b1c1975e4f18f35e401fa4/android/src/com/google/zxing/client/android/camera/CameraManager.java#L213-L233
[3]: https://github.com/zxing/zxing/blob/a65631d0b643e778b8b1c1975e4f18f35e401fa4/android/src/com/google/zxing/client/android/camera/CameraManager.java#L318-L326
[15]: https://github.com/zxing/zxing/blob/0cf3b9be71680f50c90a71ca26ce0d33664b0dd6/android-core/src/main/java/com/google/zxing/client/android/camera/CameraConfigurationUtils.java#L273-L345

```java
private static final int MIN_FRAME_WIDTH = 240;
private static final int MIN_FRAME_HEIGHT = 240;
private static final int MAX_FRAME_WIDTH = 1200; // = 5/8 * 1920
private static final int MAX_FRAME_HEIGHT = 675; // = 5/8 * 1080

// Responsible for settings the cropping area
public synchronized Rect getFramingRect() {
  if (framingRect == null) {
    if (camera == null) {
      return null;
    }
    Point screenResolution = configManager.getScreenResolution();
    if (screenResolution == null) {
      // Called early, before init even finished
      return null;
    }

    int width = findDesiredDimensionInRange(screenResolution.x, MIN_FRAME_WIDTH, MAX_FRAME_WIDTH);
    int height = findDesiredDimensionInRange(screenResolution.y, MIN_FRAME_HEIGHT, MAX_FRAME_HEIGHT);

    int leftOffset = (screenResolution.x - width) / 2;
    int topOffset = (screenResolution.y - height) / 2;
    framingRect = new Rect(leftOffset, topOffset, leftOffset + width, topOffset + height);
    Log.d(TAG, "Calculated framing rect: " + framingRect);
  }
  return framingRect;
}

// choose between default width for the cropping area
private static int findDesiredDimensionInRange(int resolution, int hardMin, int hardMax) {
  int dim = 5 * resolution / 8; // Target 5/8 of each dimension
  if (dim < hardMin) {
    return hardMin;
  }
  return Math.min(dim, hardMax);
}

// Crops the image and Scans the Barcode
/** * A factory method to build the appropriate LuminanceSource object based on the format
* of the preview buffers, as described by Camera.Parameters.
 *
 * @param data A preview frame.
 * @param width The width of the image.
 * @param height The height of the image.
 * @return A PlanarYUVLuminanceSource instance.
 */
public PlanarYUVLuminanceSource buildLuminanceSource(byte[] data, int width, int height) {
  Rect rect = getFramingRectInPreview();
  if (rect == null) {
    return null;
  }
  // Go ahead and assume it's YUV rather than die.
  return new PlanarYUVLuminanceSource(data, width, height, rect.left, rect.top,
                                      rect.width(), rect.height(), false);
}

```

# React Native Camera MLKit Example

An example project demonstrating the use of MLKit-based Text and Face Recognition features of react-native-camera.

### Features

Features of Basic Example + Face and Text Recognition.

Face Recognition: draws polygons around faces and red circles on top of face landmarks (ears, mouth, nose, etc.).

Text Recognition: draws polygons around text blocks and recognized within them.

### Setup

1. Run `yarn install`.

2. Create Firebase project, generate `google-services.json` and place it into `./android/app` folder, generate `GoogleService-Info.plist` and place it into `./ios/mlkit` folder.

3. Build project (you will likely need to manage signing if you are building for ios device)

### Contributing

- Pull Requests are welcome, if you open a pull request we will do our best to get to it in a timely manner
- Pull Request Reviews and even more welcome! we need help testing, reviewing, and updating open PRs
- If you are interested in contributing more actively, please contact me (same username on Twitter, Facebook, etc.) Thanks!
- If you want to help us coding, join Expo slack https://slack.expo.io/, so we can chat over there. (#react-native-camera)

### FAQ

## Why is `react-native-camera` not listed as a dependency in `package.json`?

`react-native` uses `metro` for dependency resolution. In order to not recursively install this example into the `node_modules` of this example we use `rn-cli.config.js` to resolve `react-native-camera`. This also allows a quicker iteration when developing (without having to `yarn install` after every single change in `react-native-camera`).
