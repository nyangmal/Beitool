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
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ViewBoard({route, navigation}) {
  const [boardData, setBoardData] = useState({
    title: 'default',
    content: 'default',
    createdTime: ['1', '2', '3', '4', '5'],
  });
  const boardType = route.params.boardType.toLowerCase();

  const readBoard = async () => {
    await fetch(`http://52.79.203.173:8080/board/${boardType}/post/read/`, {
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
        setBoardData(res);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const deleteBoard = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/post/delete/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        id: route.params.id,
        boardType: boardType,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log('게시글 삭제');
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
                navigation.navigate('ModifyBoard', {
                  boardType: boardType,
                  title: boardData.title,
                  content: boardData.content,
                  id: route.params.id,
                });
              }}>
              <Text color="primary.600" mr="5" fontSize="md">
                편집
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                deleteBoard().then(
                  navigation.reset({
                    routes: [{name: 'NoticeBoard'}],
                  }),
                );
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
        <Box flex={0.1} w="90%" mt="5%">
          <Heading>{boardData.title}</Heading>
          <HStack justifyContent="space-between" mt="3%">
            <Text color="coolGray.600">작성자 : {boardData.author}</Text>
            <Text color="coolGray.600">
              {boardData.createdTime[0]}.{boardData.createdTime[1]}.
              {boardData.createdTime[2]} {boardData.createdTime[3]}:
              {boardData.createdTime[4]}
            </Text>
          </HStack>
        </Box>
        <Divider />
        <ScrollView flex={0.9} w="90%">
          <Text mt="5%">{boardData.content}</Text>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
}

export default ViewBoard;
