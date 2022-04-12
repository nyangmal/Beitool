import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NativeBaseProvider,
  Box,
  Text,
  FormControl,
  Stack,
  Input,
  Heading,
  Button,
  Alert,
  HStack,
  Collapse,
  IconButton,
  CloseIcon,
} from 'native-base';

function PlaceJoin({navigation}) {
  const [show, setShow] = useState(false);
  const [buttonAv, setButtonAv] = useState(false);
  const [userName, setUserName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const submitInfo = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    const employeeData = JSON.stringify({
      status: 'Employee',
      userName: userName,
      inviteCode: inviteCode,
      accessToken: token.accessToken,
    });
    fetch('http://52.79.203.173:8080/store/join/', {
      //uri 바꿔야함
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: employeeData,
    })
      .then(res => res.json())
      .then(() => {
        navigation.navigate('MainScreen'); //초대코드 유효성 검사 필요
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const fieldFilled = () => {
    if (userName !== '' && inviteCode !== '') {
      setButtonAv(true);
    } else {
      setButtonAv(false);
    }
  };

  useEffect(() => {
    fieldFilled();
  });

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
        <Collapse isOpen={show} height={show === true ? 'auto' : 0}>
          <Alert w="100%" maxW="400" status="error">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <Alert.Icon />
              <Text
                fontSize="md"
                fontWeight="medium"
                _dark={{
                  color: 'coolGray.800',
                }}>
                모든 입력란을 기입해 주세요!
              </Text>
              <IconButton
                variant="unstyled"
                icon={<CloseIcon size="3" color="coolGray.600" />}
                onPress={() => setShow(false)}
              />
            </HStack>
          </Alert>
        </Collapse>
        <FormControl isRequired>
          <Stack space={4} mx="10" mt="8">
            <Input
              placeholder="나의 이름"
              onChangeText={text => {
                setUserName(text);
              }}
            />
            <Input
              placeholder="초대 코드"
              onChangeText={text => {
                setInviteCode(text);
              }}
            />
          </Stack>
        </FormControl>
        <Button
          marginTop="5"
          onTouchStart={() => {
            buttonAv === true ? submitInfo() : setShow(true);
          }}
          disabled={!buttonAv}
          colorScheme={buttonAv === true ? 'primary' : 'gray'}>
          가입하기
        </Button>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceJoin;
