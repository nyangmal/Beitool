import 'react-native-gesture-handler';
import React, {useState, useLayoutEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  TextArea,
  FormControl,
  Input,
  Button,
  VStack,
  ScrollView,
  Divider,
  Text,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ConfigScreen({navigation}) {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <ScrollView flex={1} w="100%">
          <VStack>
            <Box>
              <Text>가게 초대코드</Text>
              <Text>2414141</Text>
            </Box>
            <Divider />
            <Box></Box>
          </VStack>
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
}

export default ConfigScreen;
