import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
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
  AlertDialog,
} from 'native-base';

function PlaceJoin({navigation}) {
  const [show, setShow] = useState(false);
  const [buttonAv, setButtonAv] = useState(false);
  const [userName, setUserName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  const submitInfo = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    setIsOpen(false);
    const employeeData = JSON.stringify({
      status: 'Employee',
      userName: userName,
      inviteCode: inviteCode,
      accessToken: token.accessToken,
    });
    fetch('http://52.79.203.173:8080/store/join/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: employeeData,
    })
      .then(res => res.json())
      .then(res => {
        res.message === 'Success'
          ? navigation.navigate('MainScreen')
          : console.log('failed');
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
          <Stack space={4} mx="16" mt="8">
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
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>가게 등록</AlertDialog.Header>
            <AlertDialog.Body>
              <Text>가입 정보는 추후 변경할 수 있습니다.</Text>
              <Text>계속 진행하시겠습니까?</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}>
                  아니오
                </Button>
                <Button
                  colorScheme="primary"
                  onPress={() => {
                    submitInfo();
                  }}>
                  네
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

        <Button
          marginTop="5"
          onTouchStart={() => {
            buttonAv === true ? setIsOpen(!isOpen) : setShow(true);
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
