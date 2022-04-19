import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NativeBaseProvider, Box, Text, Heading, Spinner} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StartScreen({navigation}) {
  const [screenInfo, setScreenInfo] = useState('StartScreen'); //res.screen값 null예외처리
  const sendToken = async () => {
    const token = await AsyncStorage.getItem('kakaoToken');
    if (token) {
      fetch('http://52.79.203.173:8080/login/kakao', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: token,
      })
        .then(res => res.json())
        .then(res => {
          AsyncStorage.setItem(
            'kakaoToken',
            JSON.stringify({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            }),
          );
          setScreenInfo(res.screen);
        })
        .catch(err => {
          console.log(err.message);
        });
    } else {
      console.log('신규회원');
      setScreenInfo('LoginScreen');
    }
  };

  useEffect(() => {
    sendToken();
    setTimeout(() => {
      //연결없을 시 에러처리 필요
      navigation.navigate(screenInfo);
    }, 1500);
  }, [navigation, screenInfo]);

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
