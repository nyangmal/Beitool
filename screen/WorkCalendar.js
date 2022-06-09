import 'react-native-gesture-handler';
import React, {useState, useLayoutEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Icon,
  Fab,
  FormControl,
  Modal,
  Select,
  Button,
  FlatList,
  HStack,
  Pressable,
  AlertDialog,
} from 'native-base';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {SSRProvider} from '@react-aria/ssr';
let postId = null;
let whichTime = '';
let today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
let workDay = year + '-' + month + '-' + day; //오늘 날짜의 년,월,일 들어감

function WorkCalendar({navigation}) {
  const [showModal, setShowModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef(null);
  const onClose = () => setIsOpen(false);
  LocaleConfig.locales['kr'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1.',
      '2.',
      '3',
      '4',
      '5',
      '6',
      '7.',
      '8',
      '9.',
      '10.',
      '11.',
      '12.',
    ],
    dayNames: [
      '일요일',
      '월요일',
      '회요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
  };
  LocaleConfig.defaultLocale = 'kr';
  const [items, setItems] = useState({
    '2022-06-01': {marked: true},
    '2022-06-02': {marked: true},
    '2022-06-10': {marked: true},
  }); //마커 표시 정보

  const [inputs, setInputs] = useState({
    workStartTime: '날짜 선택',
    workEndTime: '날짜 선택',
    employee: '',
  }); //일정 생성시 입력 정보

  const [data, setData] = useState({
    workInfos: [
      {
        id: 2,
        employeeName: '직원',
        authorName: '예시1',
        workStartTime: [2022, 6, 1, 16, 0],
        workEndTime: [2022, 6, 1, 18, 0],
      },
    ],
  }); //밑에 flatList에 표시할 정보

  const [employeeList, setEmployeeList] = useState({
    employees: [
      {
        employeeId: 2,
        employeeName: '직원2',
      },
    ],
    message: 'Success',
  }); //직원 정보

  const showDatePicker = str => {
    whichTime = str;
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const temp = JSON.stringify(date);
    if (whichTime === 'workStartTime') {
      //시작일을 입력하는 경우에만 workDay 할당
      workDay = temp.substr(1, 10);
    }
    onChange(whichTime, temp.substr(1, 10) + ' ' + temp.substr(12, 5));
    hideDatePicker();
  };

  const onChange = (keyvalue, e) => {
    setInputs({
      ...inputs,
      [keyvalue]: e,
    });
  };

  const getMarker = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    let tempObj = {};
    await fetch('http://52.79.203.173:8080/work/read/schedule/monthly/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        workDay: workDay,
      }),
    })
      .then(res => res.json())
      .then(res => {
        res.workInfos.map(obj => {
          tempObj = {
            ...tempObj,
            [`'${obj.workDay[0]}-${obj.workDay[1]}-${obj.workDay[2]}'`]: {
              marked: true,
            },
          };
        });
      })
      .then(() => {
        setItems({...tempObj});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const getEmployee = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/store/belong/employee/', {
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
        setEmployeeList({...res});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const getSchedule = async inputDay => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/work/read/schedule/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        day: inputDay,
      }),
    })
      .then(res => res.json())
      .then(res => {
        setData({...res});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const createSchedule = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/work/create/schedule/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        employee: inputs.employee,
        workStartTime: inputs.workStartTime,
        workEndTime: inputs.workEndTime,
        workDay: workDay,
      }),
    })
      .then(res => res)
      .then(res => {})
      .catch(err => {
        console.log(err.message);
      });
    await getSchedule(workDay);
  };

  const deleteSchedule = async id => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/work/delete/schedule/', {
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
      .then(res => {})
      .catch(err => {
        console.log(err.message);
      });
    onClose();
    await getSchedule(workDay);
  };

  useLayoutEffect(() => {
    getMarker();
    getSchedule(workDay);
    getEmployee();
  }, []);

  return (
    <SSRProvider>
      <NativeBaseProvider>
        <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
          <Box
            mt="5%"
            flex={1}
            w="90%"
            borderWidth="1"
            borderColor="coolGray.200"
            rounded="lg"
            justifyContent="center">
            <Calendar
              enableSwipeMonths
              onDayPress={day => {
                getSchedule(day.dateString);
              }}
              onMonthChange={month => {
                workDay = month.dateString;
                getMarker();
              }}
              markedDates={items}
            />
          </Box>
          <Box flex={1} w="90%">
            <FlatList
              data={data.workInfos}
              renderItem={({item}) => (
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
                    pl="4"
                    pr="4"
                    py="3">
                    <HStack
                      space={3}
                      justifyContent="space-between"
                      alignItems="center">
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.employeeName}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}
                        fontSize="xs">
                        {item.workStartTime[0]}년 {item.workStartTime[1]}월{' '}
                        {item.workStartTime[2]}일 {item.workStartTime[3]}시{' '}
                        {item.workStartTime[4]}분 ~ {item.workEndTime[0]}년{' '}
                        {item.workEndTime[1]}월 {item.workEndTime[2]}일{' '}
                        {item.workEndTime[3]}시 {item.workEndTime[4]}분
                      </Text>
                    </HStack>
                  </Box>
                </Pressable>
              )}
              keyExtractor={item => item.id}
            />
          </Box>
        </Box>
        <Fab
          renderInPortal={false}
          onPress={() => {
            setShowModal(true);
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
                <FormControl.Label>시작일</FormControl.Label>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="light"
                  onPress={() => {
                    showDatePicker('workStartTime');
                  }}>
                  {inputs.workStartTime}
                </Button>
              </FormControl>
              <FormControl mt="2">
                <FormControl.Label>종료일</FormControl.Label>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="light"
                  onPress={() => {
                    showDatePicker('workEndTime');
                  }}>
                  {inputs.workEndTime}
                </Button>
              </FormControl>
              <FormControl mt="2">
                <FormControl.Label>담당 직원</FormControl.Label>
                <Select
                  placeholder="직원을 선택해주세요"
                  onValueChange={e => {
                    onChange('employee', e);
                  }}>
                  {employeeList.employees.map(a => {
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
                    createSchedule();
                    setShowModal(false);
                  }}>
                  등록하기
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            timeZoneOffsetInMinutes
          />
        </Modal>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>업무 삭제</AlertDialog.Header>
            <AlertDialog.Body>
              <Text>배정된 근무를 삭제하시겠습니까?</Text>
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
                    deleteSchedule(postId);
                  }}>
                  삭제하기
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </NativeBaseProvider>
    </SSRProvider>
  );
}

export default WorkCalendar;
