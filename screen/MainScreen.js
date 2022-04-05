import 'react-native-gesture-handler';
import React from 'react';
import {NativeBaseProvider, Box, Text} from 'native-base';

function MainScreen() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text marginBottom="50" fontSize="lg">
          메인스크린
        </Text>
      </Box>
    </NativeBaseProvider>
  );
}

export default MainScreen;
