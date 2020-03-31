import React, { useCallback, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Camera from './src/utils/Camera';

const App: () => React$Node = () => {
  const [showCamera, setShowCamera] = useState(true);

  const styles = StyleSheet.create({
    flipButton: {
      flex: 0.3,
      height: 40,
      marginHorizontal: 2,
      marginBottom: 10,
      marginTop: 10,
      borderRadius: 8,
      borderColor: 'white',
      borderWidth: 1,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Button title="Show/hide camera" onPress={() => setShowCamera(!showCamera)} />
      <View style={{ flex: 1 }} />
      {showCamera ? <Camera /> : <View />}
    </View>
  );
};
