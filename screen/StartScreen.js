import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NativeBaseProvider, Box, Text, Heading, Spinner} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StartScreen({navigation}) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 3000);
    // eslint-disable-next-line handle-callback-err
    AsyncStorage.getItem('accessToken', (err, result) => {
      result === null ? console.log('토큰 값 없음') : console.log(result);
    });
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
          <Spinner size="lg" color="gray" mt="10" />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}

export default StartScreen;
