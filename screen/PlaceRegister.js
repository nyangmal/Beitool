import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
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
  Alert,
  HStack,
  Collapse,
  IconButton,
  CloseIcon,
} from 'native-base';

function PlaceRegister() {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [buttonAv, setButtonAv] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('도로명 주소');
  const [detailAddr, setDetailAddr] = useState('');
  const submitInfo = () => {
    const tempData = {
      placeName: placeName,
      address: address,
      detailAddr: detailAddr,
    };
    const jsonTempData = JSON.stringify(tempData);
    console.log(tempData);
  };

  const fieldFilled = () => {
    if (placeName !== '' && detailAddr !== '' && address !== '도로명 주소') {
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
              placeholder="가게 이름"
              onChangeText={text => {
                setPlaceName(text);
              }}
            />
            <Button
              colorScheme="gray"
              variant="outline"
              onPress={() => setShowModal(true)}>
              {address}
            </Button>
            <Input
              placeholder="상세 주소"
              onChangeText={text => {
                setDetailAddr(text);
              }}
            />
          </Stack>
        </FormControl>
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          size={'xl'}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>우편번호 검색</Modal.Header>
            <Modal.Body>
              <Postcode
                style={{width: 330, height: 450}}
                jsOptions={{animation: true}}
                onSelected={data => {
                  let temp = JSON.stringify(data.address);
                  setAddress(temp.replace(/"/g, ''));
                  setShowModal(false);
                }}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Button
          marginTop="5"
          onTouchStart={() => {
            buttonAv === true ? submitInfo() : setShow(true);
          }}
          disabled={!buttonAv}
          colorScheme={buttonAv === true ? 'primary' : 'gray'}>
          제출하기
        </Button>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceRegister;
