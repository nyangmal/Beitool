import 'react-native-gesture-handler';
import React, {useLayoutEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Fab,
  Icon,
  FlatList,
  Text,
  VStack,
  HStack,
  Spacer,
  Pressable,
  Avatar,
  IconButton,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

function StockManage({navigation}) {
  const [stockData, setStockData] = useState({});
  const getStock = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/stock/read/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
      }),
    })
      .then(res => res.json())
      .then(res => {
        setStockData({...res});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  navigation.setOptions({
    headerLeft: () => (
      <NativeBaseProvider>
        <IconButton
          icon={
            <Icon
              as={AntDesign}
              name="left"
              size="sm"
              onPress={() => {
                navigation.navigate('MainScreen');
              }}
            />
          }
          _icon={{
            color: 'blue.500',
            size: 'sm',
          }}
        />
      </NativeBaseProvider>
    ),
  });

  useLayoutEffect(() => {
    getStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={1} w="100%">
          <FlatList
            data={stockData.stocks}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  navigation.navigate('ViewStock', {id: item.id});
                }}>
                <Box
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'gray.600',
                  }}
                  borderColor="coolGray.200"
                  pl="4"
                  pr="5"
                  py="4">
                  <HStack
                    space={3}
                    justifyContent="space-between"
                    alignItems="center">
                    <Avatar
                      size="52px"
                      source={{
                        uri: null,
                      }}
                    />
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.title}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.description}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text
                      fontSize="xs"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      alignSelf="flex-start">
                      유통기한 : {item.expirationTime[0]}-
                      {item.expirationTime[1]}-{item.expirationTime[2]}
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </Box>
        <Fab
          renderInPortal={false}
          onPress={() => {
            navigation.navigate('CreateStock');
          }}
          shadow={2}
          size="sm"
          icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
        />
      </Box>
    </NativeBaseProvider>
  );
}

export default StockManage;
