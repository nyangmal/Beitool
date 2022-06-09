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
  Text,
  VStack,
  Center,
} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

let positionVar = 'President';
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
        positionVar = res.position;
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
        <Box flex={0.8} alignItems="center" mt="40%">
          <HStack>
            <Heading size="2xl">{activeStore}</Heading>
            <IconButton
              onPress={() => {
                navigation.navigate('PlaceChange');
              }}
              h="12"
              icon={<Icon as={Entypo} name="cycle" size="md" />}
            />
          </HStack>
          {positionVar === 'Waiting' ? (
            <Text color="red.500" fontSize="xl">
              가게 가입 승인 대기중입니다.
            </Text>
          ) : null}
          <Button
            mt="40%"
            onPress={() => {
              navigation.navigate('CommuteScreen');
            }}
            size="lg"
            isDisabled={positionVar === 'Waiting'}
            colorScheme="blue">
            출근 - 퇴근 하기
          </Button>
        </Box>
        {positionVar === 'Waiting' ? null : (
          <Box w="90%" flex={1.2}>
            <VStack
              alignItems="center"
              space={8}
              w="100%"
              h="80%"
              justifyContent="center">
              <HStack space={10} justifyContent="center">
                <Center>
                  <IconButton
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="amber.600"
                    onPress={() => navigation.navigate('TodoList')}
                    icon={<Icon color="white" name="tasks" as={FontAwesome5} />}
                  />
                  <Text>ToDo</Text>
                </Center>
                <Center>
                  <IconButton
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="emerald.600"
                    icon={
                      <Icon color="white" name="comment" as={FontAwesome5} />
                    }
                  />
                  <Text>채팅</Text>
                </Center>
                <Center>
                  <IconButton
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="blue.600"
                    onPress={() => {
                      navigation.navigate('WorkCalendar');
                    }}
                    icon={
                      <Icon
                        pl="0.5"
                        color="white"
                        name="calendar-alt"
                        as={FontAwesome5}
                      />
                    }
                  />
                  <Text>캘린더</Text>
                </Center>
              </HStack>
              <HStack space={10} justifyContent="center">
                <Center>
                  <IconButton
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="orange.600"
                    onPress={() => navigation.navigate('NoticeBoard')}
                    icon={
                      <Icon
                        pl="1"
                        color="white"
                        name="clipboard-list"
                        as={FontAwesome5}
                      />
                    }
                  />
                  <Text>게시판</Text>
                </Center>
                <Center>
                  <IconButton
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="rose.600"
                    onPress={() => navigation.navigate('StockManage')}
                    icon={
                      <Icon
                        color="white"
                        name="shopping-basket"
                        as={FontAwesome5}
                      />
                    }
                  />
                  <Text>재고관리</Text>
                </Center>
                <Center>
                  <IconButton
                    borderRadius="full"
                    variant="solid"
                    p="3"
                    bg="violet.600"
                    onPress={() => {
                      navigation.navigate(`CalculateSalary${positionVar}`);
                    }}
                    icon={
                      <Icon
                        color="white"
                        pl="0.5"
                        name="calculator"
                        as={FontAwesome5}
                      />
                    }
                  />
                  <Text>급여계산기</Text>
                </Center>
              </HStack>
              <Center>
                <IconButton
                  onPress={() => navigation.navigate('ConfigScreen')}
                  borderRadius="full"
                  variant="solid"
                  p="3"
                  bg="lime.600"
                  icon={<Icon color="white" name="tools" as={FontAwesome5} />}
                />
                <Text>환경설정</Text>
              </Center>
            </VStack>
          </Box>
        )}
      </Box>
    </NativeBaseProvider>
  );
}

export default MainScreen;
