import 'react-native-gesture-handler';
import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  FormControl,
  Stack,
  Input,
  WarningOutlineIcon,
} from 'native-base';

function PlaceRegister() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <FormControl isRequired>
          <Stack mx="4">
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              defaultValue="12345"
              placeholder="password"
            />
            <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
      </Box>
    </NativeBaseProvider>
  );
}

export default PlaceRegister;
