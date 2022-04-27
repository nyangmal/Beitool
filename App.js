import 'react-native-gesture-handler';
import React from 'react';
import {LogBox, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//npx react-native run-ios --simulator="iPhone SE (3rd generation)"
import StartScreen from './screen/StartScreen';
import LoginScreen from './screen/LoginScreen';
import UserSelect from './screen/UserSelect';
import PlaceRegister from './screen/PlaceRegister';
import PlaceJoin from './screen/PlaceJoin';
import MainScreen from './screen/MainScreen';
import CommuteScreen from './screen/CommuteScreen';
import PlaceChange from './screen/PlaceChange';
import NoticeBoard from './screen/NoticeBoard';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs();
export default function App({}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="StartScreen"
          component={StartScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="UserSelect"
          component={UserSelect}
        />
        <Stack.Screen
          name="PlaceRegister"
          component={PlaceRegister}
          options={{title: '', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="PlaceJoin"
          component={PlaceJoin}
          options={{title: '', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CommuteScreen"
          component={CommuteScreen}
          options={{title: '', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="PlaceChange"
          component={PlaceChange}
          options={{
            title: '',
            headerBackTitle: ' 돌아가기',
          }}
        />
        <Stack.Screen
          name="NoticeBoard"
          component={NoticeBoard}
          options={{
            title: '',
            headerBackTitle: ' 돌아가기',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
