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

function LoginScreen({navigation}) {
  const loginProcess = async () => {
    const token = await login();
    console.log(JSON.stringify(token));
    fetch('http://52.79.203.173:8080/login/kakao', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(token),
    }).then(res => res.json());
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
        <TouchableOpacity activeOpacity={0.6} onPress={loginProcess}>
          <Image source={require('../kakao_login.png')} />
        </TouchableOpacity>
        <Button
          marginTop="5"
          onPress={() => {
            navigation.navigate('UserSelect');
          }}>
          다음화면
        </Button>
      </Box>
    </NativeBaseProvider>
  );
}

export default LoginScreen;
