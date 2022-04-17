import 'react-native-gesture-handler';
import React from 'react';
import {NativeBaseProvider, Box, Text, Button, Heading} from 'native-base';

function UserSelect({navigation}) {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Box marginBottom="1/2">
          <Text fontSize="18" textAlign="right" lineHeight="xs">
            바이툴
          </Text>
          <Heading size="4xl" lineHeight="xs">
            Beitool
          </Heading>
        </Box>
        <Button.Group
          isAttached
          size="lg"
          colorScheme="blue"
          mx={{base: 'auto', md: 0}}>
          <Button
            onPress={() => {
              navigation.navigate('PlaceRegister');
            }}>
            사장님
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              navigation.navigate('PlaceJoin');
            }}>
            알바님
          </Button>
        </Button.Group>
        <Text marginTop="3" fontSize="md">
          회원님의 정보를 선택해주세요.
        </Text>
      </Box>
    </NativeBaseProvider>
  );
}

export default UserSelect;
