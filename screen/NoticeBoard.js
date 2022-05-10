import 'react-native-gesture-handler';
import React, {useLayoutEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  IconButton,
  Button,
  Fab,
  Icon,
  FlatList,
  Text,
  VStack,
  HStack,
  Spacer,
  Pressable,
  Select,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NoticeBoard({navigation}) {
  const [boardList, setBoardList] = useState({});
  const [buttonColor, setButtonColor] = useState(true);
  const [page, setPage] = useState(1);
  let tempArr = [];
  const [pageArr, setPageArr] = useState([]);

  const getBoard = async boardType => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/read/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        boardType: boardType,
        page: page,
      }),
    })
      .then(res => res.json())
      .then(res => {
        setBoardList([...res.posts]);
        if (res.message === 'Success') {
          tempArr = [];
          for (let index = 1; index < res.totalPage + 1; index++) {
            tempArr.push(index);
          }
          setPageArr([...tempArr]);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  async function changePageVal(itemValue) {
    await setPage(itemValue);
  }

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
    headerTitle: () => (
      <NativeBaseProvider>
        <Button.Group
          isAttached
          size="md"
          colorScheme="blue"
          mx={{base: 'auto', md: 0}}>
          <Button
            variant={buttonColor === true ? null : 'outline'}
            onPress={() => {
              getBoard('Announcement');
              setButtonColor(true);
            }}>
            공지사항
          </Button>
          <Button
            variant={buttonColor === false ? null : 'outline'}
            onPress={() => {
              getBoard('Free');
              setButtonColor(false);
            }}>
            게시판
          </Button>
        </Button.Group>
      </NativeBaseProvider>
    ),
  });

  useLayoutEffect(() => {
    getBoard('Announcement');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={0.9} w="100%">
          <FlatList
            data={boardList}
            renderItem={({item}) => (
              <Pressable
                onPress={() => {
                  navigation.navigate('ViewBoard', {
                    id: item.id,
                    boardType: item.dtype,
                  });
                }}>
                <Box
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'gray.600',
                  }}
                  borderColor="coolGray.200"
                  pl="6"
                  pr="6"
                  py="3">
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack w="80%">
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
                        {item.authorName}
                      </Text>
                    </VStack>
                    <Box w="20%">
                      <Text color="coolGray.600">
                        {item.createdTime[0]}.{item.createdTime[1]}.
                        {item.createdTime[2]}
                      </Text>
                    </Box>
                    <Spacer />
                  </HStack>
                </Box>
              </Pressable>
            )}
            keyExtractor={item => item.id}
          />
        </Box>
        <Box flex={0.1} w="30%">
          <Select
            selectedValue={page}
            placeholder={`${page} 페이지`}
            onValueChange={itemValue => {
              changePageVal(itemValue).then(() => {
                getBoard(buttonColor === true ? 'Announcement' : 'Free');
              });
            }}>
            {pageArr.map((a, i) => (
              <Select.Item label={`${a} 페이지`} value={a} />
            ))}
          </Select>
        </Box>
        <Fab
          renderInPortal={false}
          onPress={() => {
            navigation.navigate('CreateBoard', {boardType: buttonColor});
          }}
          shadow={2}
          size="sm"
          icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
        />
      </Box>
    </NativeBaseProvider>
  );
}

export default NoticeBoard;
