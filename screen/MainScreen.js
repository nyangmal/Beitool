import 'react-native-gesture-handler';
import React, {useState, useLayoutEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Button,
  IconButton,
  Icon,
  HStack,
  Menu,
  Pressable,
} from 'native-base';
import {Calendar} from 'react-native-calendars';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MainScreen({navigation}) {
  const [activeStore, setActiveStore] = useState('가게 이름');

  const getInfo = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/store/main/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({accessToken: token.accessToken}),
    })
      .then(res => res.json())
      .then(res => {
        AsyncStorage.setItem('position', res.position);
        setActiveStore(res.storeName);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useLayoutEffect(() => {
    getInfo();
  }, []);
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <HStack flex={0.6} mt="40%">
          <Heading size="2xl">{activeStore}</Heading>
          <IconButton
            onPress={() => {
              navigation.navigate('PlaceChange');
            }}
            h="12"
            icon={<Icon as={Entypo} name="cycle" size="md" />}
          />
        </HStack>
        <Button
          mb="10"
          onPress={() => {
            navigation.navigate('CommuteScreen');
          }}
          size="lg"
          colorScheme="blue">
          출근 - 퇴근 하기
        </Button>
        <Box w="90%" flex={1}>
          <Calendar />
        </Box>
        <Menu
          placement="top"
          w="190"
          trigger={triggerProps => {
            return (
              <Pressable
                mb="6"
                accessibilityLabel="More options menu"
                {...triggerProps}>
                <Icon as={Entypo} name="chevron-up" size="xl" />
              </Pressable>
            );
          }}>
          <Menu.Item onPress={() => navigation.navigate('TodoList')}>
            ToDo
          </Menu.Item>
          <Menu.Item isDisabled>채팅</Menu.Item>
          <Menu.Item isDisabled>캘린더</Menu.Item>
          <Menu.Item onPress={() => navigation.navigate('NoticeBoard')}>
            게시판
          </Menu.Item>
          <Menu.Item onPress={() => navigation.navigate('StockManage')}>
            재고관리
          </Menu.Item>
          <Menu.Item isDisabled>급여계산</Menu.Item>
          <Menu.Item isDisabled>환경설정</Menu.Item>
        </Menu>
      </Box>
    </NativeBaseProvider>
  );
}

export default MainScreen;
