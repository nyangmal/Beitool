import 'react-native-gesture-handler';
import React from 'react';
import {
  NativeBaseProvider,
  Heading,
  Box,
  Button,
  Text,
  Image,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {login} from '@react-native-seoul/kakao-login';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({navigation}) {
  const loginProcess = async () => {
    const token = await login();
    if (token) {
      AsyncStorage.setItem(
        'kakaoToken',
        JSON.stringify({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        }),
      );
      await fetch('http://52.79.203.173:8080/login/kakao/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(token),
      })
        .then(res => res.json())
        .then(() => {
          navigation.navigate('UserSelect');
        })
        .catch(err => {
          console.log(err.message);
        });
    } else {
      console.log('토큰값 오류');
    }
  };
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box marginBottom="1/2">
          <Text fontSize="18" textAlign="right" lineHeight="xs">
            바이툴
          </Text>
          <Heading size="4xl" lineHeight="xs">
            Beitool
          </Heading>
        </Box>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            loginProcess();
          }}>
          <Image alt="로그인 버튼" source={require('../kakao_login.png')} />
        </TouchableOpacity>
      </Box>
    </NativeBaseProvider>
  );
}

export default LoginScreen;
