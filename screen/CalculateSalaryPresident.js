import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  Pressable,
  Switch,
  HStack,
  Select,
  FlatList,
  Spacer,
  Avatar,
  Icon,
  IconButton,
  Popover,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

let holidayPaySw,
  insuranceSw = false;

function CalculateSalaryPresident({navigation}) {
  const monthArr = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  const [salaryData, setSalaryData] = useState({
    employeeNum: 4, //직원 수
    totalSalary: 986210, //급여 합계
    totalWorkingHour: 107, //근로 시간 합계
    totalWorkingMin: 15, //근로 분 합계
    totalHolidayPay: 199993, //주휴수당 합계
    totalInsurance: 110194, //4대보험 합계
    salaryInfos: [
      {
        name: '직원1',
        salary: 838140,
        workingHour: 91,
        workingMin: 30,
        holidayPay: 199993,
      },
      {
        name: '직원2',
        salary: 117000,
        workingHour: 12,
        workingMin: 30,
        holidayPay: 0,
      },
      {
        name: '직원3',
        salary: 31070,
        workingHour: 3,
        workingMin: 15,
        holidayPay: 0,
      },
      {
        name: '직원4',
        salary: 0,
        workingHour: 0,
        workingMin: 0,
        holidayPay: 0,
      },
    ],
  });
  const [inputs, setInputs] = useState({
    isMonthOrWeek: '',
    requestTime: '',
    countWeek: '',
  });

  const calculateSalary = () => {
    let temp = 0;
    if (holidayPaySw === true) {
      temp += salaryData.totalHolidayPay;
    }
    if (insuranceSw === true) {
      temp -= salaryData.totalInsurance;
    }
    setCalSalary(temp + salaryData.totalSalary);
  };

  const [calSalary, setCalSalary] = useState('0');
  const getSalary = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/work/salary/president/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        ...inputs,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setSalaryData({...res});
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (inputs.isMonthOrWeek !== '' && inputs.requestTime !== '') {
      getSalary();
    }
    console.log('avc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, salaryData]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <VStack mt="2" space={2} flex={1} alignItems="center" w="100%">
          <Box
            flex={0.6}
            w="90%"
            alignItems="center"
            justifyContent="center"
            borderColor="coolGray.200"
            backgroundColor="gray.50"
            borderWidth="1"
            rounded="lg"
            shadow="2">
            <Box
              flex={0.8}
              w="100%"
              alignItems="center"
              justifyContent="center">
              <HStack alignItems="center" space={2}>
                <Select
                  textAlign="center"
                  accessibilityLabel="월"
                  placeholder="N"
                  selectedValue={inputs.requestTime}
                  minW="15%"
                  onValueChange={e => setInputs({...inputs, requestTime: e})}>
                  {monthArr.map((month, index) => {
                    return (
                      <Select.Item
                        label={JSON.stringify(index + 1)}
                        value={'2022-' + month + '-00'}
                        key={index}
                      />
                    );
                  })}
                </Select>
                <Heading>월 인건비 통계</Heading>
              </HStack>
            </Box>
            <Divider />
            <VStack space={3} flex={2.4} w="90%" justifyContent="center">
              <HStack
                space={2}
                alignItems="center"
                backgroundColor="white"
                rounded="md"
                borderColor="coolGray.200"
                borderWidth="1"
                paddingX="2"
                shadow="1">
                <Icon as={FontAwesome} name="user" size="md" color="blue.600" />
                <VStack space={1}>
                  <Text>고용 인원: {salaryData.employeeNum}명</Text>
                  <Text>
                    고용 시간 합계: {salaryData.totalWorkingHour}시간{' '}
                    {salaryData.totalWorkingMin}분
                  </Text>
                </VStack>
              </HStack>
              <HStack
                space={3}
                alignItems="center"
                backgroundColor="white"
                rounded="md"
                borderColor="coolGray.200"
                borderWidth="1"
                paddingX="2"
                shadow="1">
                <Icon as={FontAwesome} name="won" size="sm" color="blue.600" />
                <VStack space={1}>
                  <Text>
                    급여 합계: {salaryData.totalSalary.toLocaleString('ko-KR')}
                    원
                  </Text>
                  <Text>
                    주휴수당 합계:{' '}
                    {salaryData.totalHolidayPay.toLocaleString('ko-KR')}원
                  </Text>
                  <Text>
                    4대보험 합계:{' '}
                    {salaryData.totalInsurance.toLocaleString('ko-KR')}원
                    (산재보험 제외)
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Divider />
            <Box
              flex={0.8}
              w="100%"
              alignItems="center"
              justifyContent="center">
              <Heading>총계: {calSalary.toLocaleString('ko-KR')}원</Heading>
            </Box>
          </Box>
          <HStack
            flex={0.1}
            space={0.3}
            w="90%"
            backgroundColor="gray.50"
            rounded="md"
            shadow="2"
            alignItems="center"
            justifyContent="center"
            borderWidth="1"
            borderColor="coolGray.200">
            <Popover
              trigger={triggerProps => {
                return (
                  <IconButton
                    {...triggerProps}
                    icon={
                      <Icon
                        as={AntDesign}
                        name="questioncircle"
                        size="sm"
                        color="blue.500"
                      />
                    }
                    borderRadius="full"
                    size="sm"
                  />
                );
              }}>
              <Popover.Content accessibilityLabel="4대보험 안내">
                <Popover.CloseButton />
                <Popover.Header>4대 보험</Popover.Header>
                <Popover.Body>
                  <VStack>
                    <HStack>
                      <Text bold>공제 기준: </Text>
                      <Text>월 근로 60시간 이상{'\n'}</Text>
                    </HStack>
                    <HStack>
                      <Text bold>국민 연금: </Text>
                      <Text>월 소득액 6.99%</Text>
                    </HStack>
                    <Text bold>건강보험</Text>
                    <Text ml="10%">
                      건강보험료: 월 소득액 6.99%{'\n'}장기요양보험료:
                      건강보험료 12.27%
                    </Text>
                    <Text bold>고용보험</Text>
                    <Text ml="10%"> 실업급여: 월 소득액 0.8%{'\n'}</Text>
                    <Text color="red.500">
                      *사업주가 공제해야 할 세금은 포함되지 않습니다.{'\n'}
                      **소득세 공제 또한 포함되지 않습니다.
                    </Text>
                  </VStack>
                </Popover.Body>
              </Popover.Content>
            </Popover>
            <Text fontSize="md">4대보험</Text>
            <Switch
              size="sm"
              onValueChange={() => {
                insuranceSw = !insuranceSw;
                calculateSalary();
              }}
            />
            <Popover
              trigger={triggerProps => {
                return (
                  <IconButton
                    {...triggerProps}
                    icon={
                      <Icon
                        as={AntDesign}
                        name="questioncircle"
                        size="sm"
                        color="blue.500"
                      />
                    }
                    borderRadius="full"
                    size="sm"
                  />
                );
              }}>
              <Popover.Content accessibilityLabel="주휴수당 안내">
                <Popover.CloseButton />
                <Popover.Header>주휴 수당</Popover.Header>
                <Popover.Body>
                  <VStack>
                    <Text bold>지급 기준</Text>
                    <Text>일주일 15시간 이상 근로</Text>
                    <Text>근로 계약서 상 근로일수를 결근하지 않은 경우</Text>
                    <Text>5인 미만 사업장도 적용{'\n'}</Text>
                    <HStack>
                      <Text bold>금액 </Text>
                      <Text>시급 X 근로 시간{'\n'}</Text>
                    </HStack>
                    <Text>
                      예) 시급 9160원, 하루에 3시간씩{'\n'}5일 근무하면 27,480원
                    </Text>
                  </VStack>
                </Popover.Body>
              </Popover.Content>
            </Popover>
            <Text fontSize="md">주휴수당</Text>
            <Switch
              size="sm"
              onValueChange={() => {
                holidayPaySw = !holidayPaySw;
                calculateSalary();
              }}
            />
            <Select
              accessibilityLabel="임금"
              minW="15%"
              placeholder="임금"
              selectedValue={inputs.isMonthOrWeek}
              onValueChange={e => {
                const strArr = e.split('/');
                setInputs({
                  ...inputs,
                  isMonthOrWeek: strArr[0],
                  countWeek: strArr[1],
                });
              }}>
              <Select.Item label="월급" value="Month/0" />
              <Select.Item label="1주차 주급" value="Week/1" />
              <Select.Item label="2주차 주급" value="Week/2" />
              <Select.Item label="3주차 주급" value="Week/3" />
              <Select.Item label="4주차 주급" value="Week/4" />
            </Select>
          </HStack>
          <Box
            flex={1}
            w="100%"
            alignItems="center"
            justifyContent="flex-start">
            <Divider />
            <FlatList
              w="100%"
              data={salaryData.salaryInfos}
              renderItem={({item}) => (
                <>
                  <Pressable>
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
                      <HStack space={7} alignItems="center">
                        <Avatar source={null}></Avatar>
                        <VStack>
                          <Text color="coolGray.800" bold>
                            {item.name}
                          </Text>
                          <Text>이번달(주) 근무시간: </Text>
                          <Text>
                            금액 : {item.salary.toLocaleString('ko-KR')} 원
                          </Text>
                        </VStack>
                        <Text>
                          {item.workingHour}시간 {item.workingMin}분
                        </Text>
                        <Icon as={Entypo} name="chevron-right" size="sm" />
                      </HStack>
                      <Spacer />
                    </Box>
                  </Pressable>
                </>
              )}
              keyExtractor={item => item.id}
            />
          </Box>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}

export default CalculateSalaryPresident;
