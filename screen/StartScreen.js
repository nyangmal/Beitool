import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NativeBaseProvider, Box, Text, Heading} from 'native-base';

function StartScreen({navigation}) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 3000);
    return () => clearTimeout(timerId);
  }, [navigation]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box>
          <Text fontSize="18" textAlign="right" lineHeight="xs">
            바이툴
          </Text>
          <Heading size="4xl" lineHeight="xs">
            Beitool
          </Heading>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}

export default StartScreen;
