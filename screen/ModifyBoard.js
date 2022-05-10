import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  TextArea,
  FormControl,
  Input,
  Button,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ModifyBoard({route, navigation}) {
  let buttonAv = true;
  const [title, setTitle] = useState(route.params.title);
  const [content, setContent] = useState(route.params.content);
  let boardType = route.params.boardType;

  const changeBoard = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch(`http://52.79.203.173:8080/board/${boardType}/post/update/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        title: title,
        content: content,
        id: route.params.id,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <FormControl
          alignItems="center"
          onChangeText={
            title === '' || content === ''
              ? (buttonAv = true)
              : (buttonAv = false)
          }>
          <FormControl.Label>글 제목</FormControl.Label>
          <Input
            value={title}
            w="80%"
            mb="5"
            onChangeText={text => {
              setTitle(text);
            }}
          />
          <FormControl.Label>글 내용</FormControl.Label>
          <TextArea
            value={content}
            w="80%"
            h="70%"
            mb="5"
            onChangeText={text => {
              setContent(text);
            }}
          />
          <Button
            isDisabled={buttonAv}
            onPress={() =>
              changeBoard().then(
                navigation.reset({
                  routes: [{name: 'NoticeBoard'}],
                }),
              )
            }>
            수정하기
          </Button>
        </FormControl>
      </Box>
    </NativeBaseProvider>
  );
}

export default ModifyBoard;
