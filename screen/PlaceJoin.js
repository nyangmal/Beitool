import 'react-native-gesture-handler';
import React from 'react';
import {NativeBaseProvider, Box, Text} from 'native-base';

function PlaceJoin() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text marginBottom="50" fontSize="lg">
          가게 등록 페이지
        </Text>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceJoin;
