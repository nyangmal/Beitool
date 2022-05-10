import 'react-native-gesture-handler';
import React, {useLayoutEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Spacer,
  FlatList,
  Pressable,
  IconButton,
  Icon,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PlaceChange({navigation}) {
  const [placeInfo, setPlaceInfo] = useState([]); //글 정보 배열
  const [activeStore, setActiveStore] = useState('가게 이름');
  const [activePosition, setActivePosition] = useState('직급');

  const getPlace = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/store/belonginfo/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({accessToken: token.accessToken}),
    })
      .then(res => res.json())
      .then(res => {
        setActiveStore(res.activeStoreName);
        res.activeStorePosition === 'President'
          ? setActivePosition('사장님')
          : setActivePosition('알바님');
        setPlaceInfo(res.belongedStore);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const sendSelection = async sel => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/member/change/activestore/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({accessToken: token.accessToken, storeId: sel}),
    }).catch(err => {
      console.log(err.message);
    });
  };

  useLayoutEffect(() => {
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
                  navigation.reset({routes: [{name: 'MainScreen'}]});
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
    getPlace();
  }, [navigation]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={0.8} w="90%" textAlign="left" mt="5">
          <Heading size="2xl">
            {activeStore} - {activePosition}
          </Heading>
        </Box>
        <Box flex={8} w="100%" h="100%">
          <FlatList
            data={placeInfo}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  sendSelection(item.storeId).then(() => getPlace());
                }}>
                <Box
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'gray.600',
                  }}
                  borderColor="coolGray.200"
                  pl="6"
                  pr="6"
                  py="2">
                  <HStack space={3} justifyContent="space-between">
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.storeName}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.memberName}
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
                      {item.memberPosition === 'President'
                        ? '사장님'
                        : '알바님'}
                    </Text>
                  </HStack>
                </Box>
              </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceChange;
