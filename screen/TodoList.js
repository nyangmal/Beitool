import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  HStack,
  Checkbox,
  Icon,
  FlatList,
  Spacer,
  Fab,
  Pressable,
  AlertDialog,
  Button,
  Modal,
  FormControl,
  Input,
  VStack,
  Select,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

LogBox.ignoreLogs(['Warning: ...']);
let postId = null;

function TodoList() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [showModal, setShowModal] = useState(false);
  const cancelRef = React.useRef(null);
  const [createdTitle, setCreatedTitle] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [createdDate, setCreatedDate] = useState('기한을 선택해 주세요');
  const [createdEmployee, setCreatedEmployee] = useState();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setCreatedDate(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    );
    hideDatePicker();
  };

  const tempData = {
    posts: [
      {
        id: 2,
        title: 'ToDoList 내용1',
        employeeName: '직원2',
        jobDate: [2022, 5, 14],
        clear: true,
      },
      {
        id: 3,
        title: 'ToDoList 내용2',
        employeeName: '직원2',
        jobDate: [2022, 5, 14],
        clear: false,
      },
      {
        id: 4,
        title: 'ToDoList 내용3',
        employeeName: '직원3',
        jobDate: [2022, 5, 25],
        clear: false,
      },
    ],
    message: 'Success',
  };

  const tempEmployee = {
    employees: [
      {
        employeeId: 2,
        employeeName: '직원2',
      },
      {
        employeeId: 3,
        employeeName: '직원3',
      },
      {
        employeeId: 4,
        employeeName: '직원4',
      },
    ],
    message: 'Success',
  };

  const getTodo = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/todo/read/', {
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
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const deleteTodo = async id => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/post/delete/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        boardType: 'ToDoList',
        id: id,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
    onClose();
    await getTodo();
  };

  const checkTodo = async id => {
    await fetch('http://52.79.203.173:8080/board/todo/clear/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
    await getTodo();
  };

  const getEmployee = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/belong/employee/', {
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
        console.log(res); //직원목록 저장해야함
      })
      .catch(err => {
        console.log(err.message);
      });
    setShowModal(true);
  };

  const createTodo = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/board/todo/create/post/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        jobDate: createdDate,
        employee: createdEmployee,
        title: createdTitle,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err.message);
      });
    await getTodo();
    setShowModal(false);
  };

  useLayoutEffect(() => {
    getTodo();
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box flex={1} w="100%">
          <FlatList
            data={tempData.posts}
            renderItem={({item}) => (
              <>
                <Pressable
                  onPress={() => {
                    postId = item.id;
                    setIsOpen(!isOpen);
                  }}>
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: 'gray.600',
                    }}
                    borderColor="coolGray.200"
                    pl="6"
                    pr="6"
                    py="3"
                    w="100%">
                    <VStack space={2}>
                      <HStack
                        justifyContent="space-between"
                        alignItems="center">
                        <Text alignSelf="flex-start" bold>
                          {item.jobDate[0]}년 {item.jobDate[1]}월{' '}
                          {item.jobDate[2]}일 까지
                        </Text>
                        <Text
                          color="coolGray.600"
                          _dark={{
                            color: 'warmGray.200',
                          }}>
                          {item.employeeName} 에게
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent="space-between"
                        alignItems="center">
                        <Text
                          _dark={{
                            color: 'warmGray.50',
                          }}
                          color="coolGray.800"
                          maxW="60%">
                          {item.title}
                        </Text>
                        <Checkbox
                          isDisabled={false}
                          value={true}
                          defaultIsChecked={item.clear === true ? true : false}
                          onChange={() => {
                            checkTodo(item.id);
                          }}
                        />
                      </HStack>
                    </VStack>
                    <Spacer />
                  </Box>
                </Pressable>
              </>
            )}
            keyExtractor={item => item.id}
          />
        </Box>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>업무 삭제</AlertDialog.Header>
            <AlertDialog.Body>
              <Text>업무가 완료되었습니다.</Text>
              <Text>배정된 업무를 삭제하시겠습니까?</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}>
                  취소
                </Button>
                <Button
                  colorScheme="danger"
                  onPress={() => {
                    deleteTodo(postId);
                  }}>
                  삭제하기
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        <Fab
          renderInPortal={false}
          onPress={() => {
            getEmployee();
          }}
          shadow={2}
          size="sm"
          icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
        />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="100%">
            <Modal.CloseButton />
            <Modal.Header>업무 등록</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>기한</FormControl.Label>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="light"
                  onPress={() => {
                    showDatePicker();
                  }}>
                  {createdDate}
                </Button>
              </FormControl>
              <FormControl mt="2">
                <FormControl.Label>내용</FormControl.Label>
                <Input
                  onChange={e => {
                    setCreatedTitle(e);
                  }}
                />
              </FormControl>
              <FormControl mt="2">
                <FormControl.Label>담당 직원</FormControl.Label>
                <Select
                  placeholder="직원을 선택해주세요"
                  onValueChange={e => setCreatedEmployee(e)}>
                  {tempEmployee.employees.map(a => {
                    return (
                      <Select.Item
                        label={a.employeeName}
                        value={a.employeeId}
                      />
                    );
                  })}
                </Select>
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  취소
                </Button>
                <Button
                  onPress={() => {
                    createTodo();
                  }}>
                  등록하기
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </Modal>
      </Box>
    </NativeBaseProvider>
  );
}

export default TodoList;
