# Table of Contents  

1. [Barcode Rectangle Of Interest (Android)](#barcode-rectangle-of-interest-(android))
2. [Visual Explanation](#visual-explanation)
3. [Javascript Implementation](#javascript-implementation)
4. [Distorsions](#distorsions)
5. [Avoiding Distortions](#avoiding-distortions)
6. [Further Help](#further-help)

# Barcode Rectangle Of Interest (Android)
<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/demo_landscape.png" alt="alt text" width="whatever" height="300px">
</p>

### Visual Explanation

This is a visual explanation of the cropping parameters in Landscape mode. `dataWidth` and `dataHeight` are the `preview` dimensions returned from the method [`cameraRef.getCameraSettings()`][20].


[20]: https://github.com/fabriziobertoglio1987/react-native-camera/blob/encapsulating-logic-in-area-class/example/examples/mlkit/src/Camera.js#L35

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
<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/landscapeWithRuler.png" alt="alt text" width="600px" height="whatever">
</p>

The same parameters are inverted in `Portrait` mode.

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

<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/portraitWithRuler.png" alt="alt text" width="600px" height="whatever">
</p>

### Javascript Implementation

Simple example on how to use the `rectOfInterest` on Android. 
[`Camera.js`][10] will retrieve the Image and Preview resolution via the react native brige once `onCameraReady` is triggered.

```javascript
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
  const dimensions = useDimensions();
  const screen = dimensions.screen;
  const window = dimensions.window;
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
    }
  }, [screen])

  onCameraReady = async () => {
    const resolutions = await cameraRef.getCameraSettings();
    const rectOfInterest = getRect(resolutions.preview, screen);
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
      <Frame 
        rect={rectOfInterest} 
        window={window}/>
    </RNCamera>
  );
};

export default Camera;
```

The [`rectangle.js`][11] file uses the preview resolution to calculate the `rectOfInterest` cropping parameters.

```javascript
const getRect = function(preview, screen) {
  const landscape = screen.width > screen.height;
  const dataWidth = landscape ? preview.width : preview.height;
  const dataHeight = landscape ? preview.height : preview.width;
  const WIDTH = landscape ? 600 : 800;
  const HEIGHT = landscape ? 600 : 500;
  const left = (dataWidth - WIDTH) / 2;
  const top = (dataHeight - HEIGHT) / 2;
  return {
    dataWidth,
    dataHeight,
    left,
    top,
    width: WIDTH,
    height: HEIGHT
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

const getFrameDimensions = function(rect, window) {
  const isEmpty = rect === emptyRect
  if (isEmpty) { return emptyFrame; };
  const landscape = window.width > window.height;
  const heightToPixel = window.height / rect.dataHeight;    
  const widthToPixel = window.width / rect.dataWidth;
  const top = rect.top * heightToPixel;
  const left = rect.left * widthToPixel;
  const width = rect.width * widthToPixel;
  const height = rect.height * heightToPixel;
  return {
    left,
    top,
    width,
    height
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

### Distorsions

This are the distortions created from scanning barcodes with a rectangle of interest, calculated on the image Aspect Ratio and then adapted to the screen Aspect Ratio.

Original Image resolution
<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/demo_landscape.png" alt="alt text" width="whatever" height="300px">
</p>

Image become distorted when adapted to different aspect ratio (1440 width x 1080 height)

<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/landscape.png" alt="alt text" width="whatever" height="300px">
</p>

Original Image resolution

<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/demo_portrait.png" alt="alt text" width="whatever" height="300px">
</p>

Image become distorted when adapted to different aspect ratio (1080 width x 1440 height)

<p align="center">
  <img src="https://fabriziobertoglio.s3.eu-central-1.amazonaws.com/opensource/react-native-camera/portrait.png" alt="alt text" width="whatever" height="300px">
</p>

### Avoiding Distortions 

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

### Further Help
Feel free to [open an issue](https://github.com/react-native-community/react-native-camera/issues) in the `react-native-camera` repository, if you need extra help you can check out our subscriptions on [tidelift](https://issuehunt.io/r/react-native-community/react-native-camera) and [issue hunt](https://tidelift.com/subscription/pkg/npm-react-native-camera?utm_source=npm-react-native-camera&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)... Thanks a lot for the support!

> Love react-native-camera? Please consider supporting our collective: 👉  https://opencollective.com/react-native-camera/donate
> Want this feature to be resolved faster? Please consider adding a bounty to it https://issuehunt.io/repos/33218414
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
