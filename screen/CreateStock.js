import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  FormControl,
  Input,
  Button,
  Image,
  VStack,
  HStack,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';

let formData = new FormData();
function CreateStock({navigation}) {
  const [buttonAv, setButtonAv] = useState(false);
  const [inputs, setInputs] = useState({
    productName: '',
    description: '',
    quantity: '',
    expirationTime: '',
  });
  const {productName, description, quantity} = inputs;
  const [imgUri, setImgUri] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  let productFileName = '';
  let productFilePath = '';

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const temp = JSON.stringify(date);
    setInputs({
      ...inputs,
      expirationTime: temp.substr(1, 10) + ' ' + temp.substr(12, 5),
    });
    hideDatePicker();
  };

  const uploadStock = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/stock/upload/file/', {
      method: 'POST',
      headers: {
        'Content-type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        setButtonAv(false);
        productFileName = res.productFileName;
        productFilePath = res.productFilePath;
        console.log('사진 업로드');
      })
      .catch(err => {
        console.log(err.message);
        setButtonAv(true);
      });
    await fetch('http://52.79.203.173:8080/board/stock/create/post/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        productName: inputs.productName,
        quantity: Number(inputs.quantity),
        description: inputs.description,
        expirationTime: inputs.expirationTime.concat(':00'),
        productFileName: productFileName,
        productFilePath: productFilePath,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log('세부정보 업로드');
        if (res.message === 'Success') {
          setTimeout(() => {
            navigation.reset({routes: [{name: 'StockManage'}]});
          }, 1500);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    for (var a in inputs) {
      if (inputs[a] === '') {
        setButtonAv(false);
        break;
      } else setButtonAv(true);
    }
  }, [inputs]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={1} justifyContent="center">
          <Image
            borderRadius="5"
            source={{uri: imgUri}}
            alt="이미지가 없습니다."
            size="200"
            backgroundColor="coolGray.200"
          />
          <Button
            mt="2"
            onPress={() => {
              formData = new FormData();
              ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                mediaType: 'photo',
              }).then(image => {
                formData.append('file', {
                  name: 'image',
                  uri: image.path,
                  type: image.mime,
                });
                setImgUri(image.path);
              });
            }}>
            이미지 업로드
          </Button>
        </Box>
        <FormControl flex={1} alignItems="center" textAlign="center">
          <VStack space={8} w="100%" alignItems="center">
            <Input
              value={productName}
              placeholder="상품명"
              onChangeText={e => onChange('productName', e)}
              w="80%"
            />
            <Input
              value={description}
              onChangeText={e => onChange('description', e)}
              placeholder="상세설명"
              w="80%"
            />
            <HStack space={3}>
              <Input
                value={quantity}
                onChangeText={e => onChange('quantity', e)}
                placeholder="상품갯수"
                w="20%"
                textAlign="center"
              />
              <Button
                size="sm"
                w="55%"
                variant="outline"
                colorScheme="light"
                onPress={() => {
                  showDatePicker();
                }}>
                {inputs.expirationTime !== ''
                  ? inputs.expirationTime
                  : '유통기한 선택'}
              </Button>
            </HStack>
          </VStack>
        </FormControl>
        <Box flex={0.4}>
          <Button isDisabled={!buttonAv} onPress={uploadStock}>
            등록하기
          </Button>
        </Box>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          timeZoneOffsetInMinutes
        />
      </Box>
    </NativeBaseProvider>
  );
}

export default CreateStock;
