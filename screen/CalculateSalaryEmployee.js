import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Text,
  Divider,
  HStack,
  VStack,
  Select,
  Switch,
  Popover,
  Icon,
  IconButton,
  ScrollView,
  FormControl,
  Input,
  TextArea,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

let holidayPaySw,
  insuranceSw = false;

function CalculateSalaryEmployee({navigation}) {
  const calculateSalary = () => {
    let temp = 0;
    if (holidayPaySw === true) {
      temp += salaryData.holidayPay;
    }
    if (insuranceSw === true) {
      temp -= salaryData.insurance[0];
    }
    setCalSalary(temp + salaryData.totalSalary);
  };
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
    message: 'Success',
    totalSalary: 986210, //급여 합계
    holidayPay: 199993, //주휴수당 합계
    insurance: [123, 123, 123, 123],
    workingHour: 107, //근로 시간 합계
    workingMin: 15, //근로 분 합계
    salaryHour: 9160, //시급
    workingHistories: [
      {
        workingStartTime: '2022-06-05 11:11',
        workingEndTime: '2022-06-05 15:00',
      },
      {
        workingStartTime: '2022-06-05 11:11',
        workingEndTime: '2022-06-05 15:00',
      },
    ],
  });
  const [inputs, setInputs] = useState({
    isMonthOrWeek: '',
    requestTime: '',
  });
  const [calSalary, setCalSalary] = useState('0');
  const getSalary = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    await fetch('http://52.79.203.173:8080/work/salary/employee/', {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <VStack space={2} flex={1} w="100%" alignItems="center" mt="2">
          <Box
            flex={0.1}
            w="90%"
            alignItems="center"
            justifyContent="center"
            borderColor="coolGray.200"
            backgroundColor="gray.50"
            borderWidth="1"
            rounded="lg"
            shadow="2">
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
              onValueChange={e => setInputs({...inputs, isMonthOrWeek: e})}>
              <Select.Item label="월급" value="Month" />
              <Select.Item label="주급" value="Week" />
            </Select>
          </HStack>
          <Box flex={0.8} w="90%" mt="3">
            <ScrollView w="100%">
              <FormControl isDisabled>
                <VStack space={1}>
                  <FormControl.Label>총 근무 시간</FormControl.Label>
                  <Input
                    defaultValue={`${salaryData.workingHour}시간 ${salaryData.workingMin}분`}
                    size="lg"
                  />
                  <FormControl.Label>시급</FormControl.Label>
                  <Input
                    defaultValue={`${salaryData.salaryHour.toLocaleString(
                      'ko-KR',
                    )}원`}
                    isDisabled
                    size="lg"
                  />
                  <FormControl.Label>총 급여</FormControl.Label>
                  <Input
                    defaultValue={`${salaryData.totalSalary.toLocaleString(
                      'ko-KR',
                    )}원`}
                    size="lg"
                  />
                  <FormControl.Label>주휴수당</FormControl.Label>
                  <Input
                    defaultValue={`${salaryData.holidayPay.toLocaleString(
                      'ko-KR',
                    )}원`}
                    size="lg"
                  />
                  <FormControl.Label>국민 연금</FormControl.Label>
                  <TextArea size="lg">
                    건강 보험료: {salaryData.insurance[3]}
                    {'\n'}장기요양보험료: {'\n'}
                    실업 급여:
                  </TextArea>
                  <FormControl.Label>최종 급여</FormControl.Label>
                  <Input
                    defaultValue={`${calSalary.toLocaleString('ko-KR')}원`}
                    size="lg"
                  />
                </VStack>
              </FormControl>
            </ScrollView>
          </Box>
        </VStack>
        <Divider />
      </Box>
    </NativeBaseProvider>
  );
}

export default CalculateSalaryEmployee;
