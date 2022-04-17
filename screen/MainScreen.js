import 'react-native-gesture-handler';
import React from 'react';
import {NativeBaseProvider, Box, Text, Heading, Button} from 'native-base';
import {Calendar} from 'react-native-calendars';

function MainScreen({navigation}) {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box w="100%" ml="5" flex={0.2}>
          <Heading size="2xl" lineHeight="xs">
            Beitool
          </Heading>
          <Text fontSize="14" textAlign="left" lineHeight="xs">
            바이툴
          </Text>
        </Box>
        <Box alignItems="center" flex={0.3}>
          <Heading mb="120" size="xl">
            가게 이름
          </Heading>
          <Button
            onPress={() => {
              navigation.navigate('CommuteScreen');
            }}
            size="lg"
            colorScheme="blue">
            출근 / 퇴근 하기
          </Button>
        </Box>
        <Box w="100%" flex={0.4}>
          <Calendar />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}

export default MainScreen;
