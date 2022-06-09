import 'react-native-gesture-handler';
import React, {useLayoutEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  Pressable,
  HStack,
  Divider,
  ScrollView,
  Image,
  Center,
  VStack,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ViewStock({route, navigation}) {
  const [buttonAv, setButtonAv] = useState(false);
  const [stockData, setStockData] = useState({
    authorName: '이름',
    productName: '상품명',
    quantity: '10',
    description: '설명',
    expirationTime: '',
    createdDate: '',
    productFilePath: null,
    productFileName: 'abc',
  });

  const readBoard = async () => {
    await fetch('http://52.79.203.173:8080/board/stock/post/read/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: route.params.id,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setStockData({...res});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const deleteStock = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/stock/post/delete/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        id: route.params.id,
        productFileName: stockData.productFileName,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log('재고 삭제');
        if (res.message === 'Success') {
          setButtonAv(true);
          setTimeout(() => {
            navigation.reset({routes: [{name: 'StockManage'}]});
          }, 1500);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  navigation.setOptions({
    headerRight: () => (
      <NativeBaseProvider>
        <Box h="100%" alignItems="center" justifyContent="center">
          <HStack>
            <Pressable
              onPress={() => {
                navigation.navigate('ModifyStock', {
                  stockData: stockData,
                });
              }}>
              <Text color="primary.600" mr="5" fontSize="md">
                편집
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                deleteStock();
              }}>
              <Text color="error.600" mr="5" fontSize="md">
                삭제
              </Text>
            </Pressable>
          </HStack>
        </Box>
      </NativeBaseProvider>
    ),
  });

  useLayoutEffect(() => {
    readBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={0.2} w="90%" h="100%" mt="5">
          <Heading fontSize="2xl">{stockData.productName}</Heading>
          <HStack justifyContent="space-between" mt="2">
            <VStack space={1}>
              <Text color="coolGray.800">개수 : {stockData.quantity}</Text>
              <Text alignSelf="flex-end" color="coolGray.600">
                작성자: {stockData.authorName}
              </Text>
            </VStack>
            <VStack space={1}>
              <Text color="coolGray.600">작성일: {stockData.createdDate}</Text>
              <Text color="coolGray.600">
                유통기한: {stockData.expirationTime}
              </Text>
            </VStack>
          </HStack>
          <Divider mt="3%" />
        </Box>
        <ScrollView flex={0.8} w="90%">
          <Center>
            <Image
              borderRadius="5"
              source={{uri: stockData.productFilePath}}
              alt="이미지가 없습니다."
              size="200"
              backgroundColor="coolGray.200"
            />
          </Center>
          <Text mt="5%">{stockData.description}</Text>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
}

export default ViewStock;
