import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Image,
  FormControl,
  Input,
  Button,
  VStack,
  HStack,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
let formData = new FormData();
let isImageChanged,
  isContentChanged = false;

function ModifyStock({route, navigation}) {
  const [buttonAv, setButtonAv] = useState(false);
  const [inputs, setInputs] = useState({
    ...route.params.stockData,
    quantity: JSON.stringify(route.params.stockData.quantity),
  });
  let fileInfo = {
    newFileName: route.params.stockData.productFileName,
    newFilePath: route.params.stockData.productFilePath,
  };
  const {productName, description, quantity} = inputs;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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

  const onChange = (keyvalue, e) => {
    isContentChanged = true;
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  useEffect(() => {
    for (var a in inputs) {
      if (isContentChanged === true || isImageChanged === true) {
        if (inputs[a] === '') {
          setButtonAv(false);
          break;
        } else setButtonAv(true);
      }
    }
  }, [inputs]);

  const changeStock = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    if (isImageChanged === true) {
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
          fileInfo = {
            oldFileName: inputs.productFileName,
            newFileName: res.productFileName,
            newFilePath: res.productFilePath,
            id: inputs.id,
          };
          console.log('사진 업로드 1단계');
        })
        .catch(err => {
          console.log(err.message);
        });
      await fetch('http://52.79.203.173:8080/board/stock/post/update/file/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({...fileInfo}),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          console.log('사진 업로드 2단계');
          if (res.message === 'Success' && isContentChanged !== true) {
            setTimeout(() => {
              navigation.reset({routes: [{name: 'StockManage'}]});
            }, 1500);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    }
    if (isContentChanged === true) {
      console.log(inputs);
      await fetch('http://52.79.203.173:8080/board/stock/post/update/', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: token.accessToken,
          quantity: Number(inputs.quantity),
          expirationTime: inputs.expirationTime,
          id: inputs.id,
          productName: inputs.productName,
          description: inputs.description,
          productFileName: fileInfo.newFileName,
          productFilePath: fileInfo.newFilePath,
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
    }
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={1} justifyContent="center">
          <Image
            borderRadius="5"
            source={{uri: inputs.productFilePath}}
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
                isImageChanged = true;
                formData.append('file', {
                  name: 'image',
                  uri: image.path,
                  type: image.mime,
                });
                setInputs({...inputs, productFilePath: image.path});
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
                {inputs.expirationTime}
              </Button>
            </HStack>
          </VStack>
        </FormControl>
        <Box flex={0.4}>
          <Button isDisabled={!buttonAv} onPress={changeStock}>
            수정하기
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

export default ModifyStock;
