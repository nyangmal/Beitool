import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  TextArea,
  FormControl,
  Input,
  Button,
  VStack,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CreateBoard({route, navigation}) {
  const [buttonAv, setButtonAv] = useState(false);
  const [inputs, setInputs] = useState({
    title: '',
    content: '',
  });
  const {title, content} = inputs;
  let boardType = '';
  route.params.boardType === true
    ? (boardType = 'announcement')
    : (boardType = 'free');

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const createBoard = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch(`http://52.79.203.173:8080/board/${boardType}/create/post/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        title: inputs.title,
        content: inputs.content,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log('게시물 생성');
        if (res.message === 'Success') {
          setButtonAv(false);
          setTimeout(() => {
            navigation.reset({routes: [{name: 'NoticeBoard'}]});
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
        <FormControl flex={1} alignItems="center" textAlign="center" mt="5%">
          <VStack space={4} w="100%" alignItems="center">
            <FormControl.Label>글 제목</FormControl.Label>
            <Input
              w="80%"
              value={title}
              onChangeText={e => onChange('title', e)}
            />
            <FormControl.Label>글 내용</FormControl.Label>
            <TextArea
              value={content}
              w="80%"
              h="70%"
              onChangeText={e => onChange('content', e)}
            />
            <Button
              isDisabled={!buttonAv}
              onPress={() => {
                createBoard();
              }}>
              등록하기
            </Button>
          </VStack>
        </FormControl>
      </Box>
    </NativeBaseProvider>
  );
}

export default CreateBoard;
