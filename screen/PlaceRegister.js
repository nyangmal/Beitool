import 'react-native-gesture-handler';
import React, {useState} from 'react';
import Postcode from '@actbase/react-daum-postcode';
import {
  NativeBaseProvider,
  Box,
  Text,
  FormControl,
  Stack,
  Input,
  Heading,
  Modal,
  Button,
} from 'native-base';

function PlaceRegister() {
  const [showModal, setShowModal] = useState(false);
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
        <FormControl isRequired>
          <Stack space={4} mx="10">
            <Input placeholder="가게 이름" />
            <Input placeholder="가게 주소" />
            <Input placeholder="상세 주소" />
          </Stack>
        </FormControl>
        <Button onPress={() => setShowModal(true)}>Button</Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Postcode
              style={{width: 340, height: 400}}
              jsOptions={{animation: true}}
              onSelected={data => alert(JSON.stringify(data))}
            />
          </Modal.Content>
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceRegister;
