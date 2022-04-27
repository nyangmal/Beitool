import 'react-native-gesture-handler';
import React from 'react';
import {NativeBaseProvider, Box, Center, Button, Fab, Icon} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NoticeBoard({navigation}) {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Center flex={0.8}>
          <Button.Group
            isAttached
            size="lg"
            colorScheme="blue"
            mx={{base: 'auto', md: 0}}>
            <Button onPress={() => {}}>공지사항</Button>
            <Button
              variant="outline"
              onPress={() => {
                navigation.reset({routes: [{name: 'MainScreen'}]});
              }}>
              게시판
            </Button>
          </Button.Group>
        </Center>
        <Box flex={8} backgroundColor="amber.400" w="100%"></Box>
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
        />
      </Box>
    </NativeBaseProvider>
  );
}

export default NoticeBoard;
