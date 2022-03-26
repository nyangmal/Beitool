import 'react-native-gesture-handler';
import React, {useState, useRef} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Button,
  Heading,
  AlertDialog,
} from 'native-base';

function UserSelect({navigation}) {
  const [isOpen, setIsOpen] = useState(false);
  const [userChoice, setUserChoice] = useState('');
  const onClose = () => setIsOpen(false);
  const pageChange = () => {
    setIsOpen(false);
    navigation.navigate(userChoice);
  };
  const cancelRef = useRef(null);

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
        <Button.Group
          isAttached
          size="lg"
          colorScheme="blue"
          mx={{base: 'auto', md: 0}}>
          <Button
            onPress={() => {
              setUserChoice('PlaceRegister');
              setIsOpen(!isOpen);
            }}>
            사장님
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              setUserChoice('PlaceJoin');
              setIsOpen(!isOpen);
            }}>
            알바님
          </Button>
        </Button.Group>
        <Text marginTop="5" fontSize="md">
          회원님의 정보를 선택해주세요.
        </Text>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>회원 정보 선택</AlertDialog.Header>
            <AlertDialog.Body>
              <Text>회원 정보는 추후 변경 할 수 있습니다.</Text>
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
                <Button colorScheme="primary" onPress={pageChange}>
                  네
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Box>
    </NativeBaseProvider>
  );
}

export default UserSelect;
