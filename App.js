import 'react-native-gesture-handler';
import React from 'react';
import {LogBox} from 'react-native';
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
import CreateBoard from './screen/CreateBoard';
import ViewBoard from './screen/ViewBoard';
import ModifyBoard from './screen/ModifyBoard';
import TodoList from './screen/TodoList';
import StockManage from './screen/StockManage';
import CreateStock from './screen/CreateStock';
import ViewStock from './screen/ViewStock';
import ModifyStock from './screen/ModifyStock';
import WorkCalendar from './screen/WorkCalendar';
import CalculateSalaryPresident from './screen/CalculateSalaryPresident';
import CalculateSalaryEmployee from './screen/CalculateSalaryEmployee';
import ConfigScreen from './screen/ConfigScreen';

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
          options={{title: '출퇴근', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="PlaceChange"
          component={PlaceChange}
          options={{title: '가게변경', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="NoticeBoard"
          component={NoticeBoard}
          options={{title: '게시판', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="CreateBoard"
          component={CreateBoard}
          options={{title: '게시판 생성', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="ViewBoard"
          component={ViewBoard}
          options={{title: '게시판', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="ModifyBoard"
          component={ModifyBoard}
          options={{title: '게시판 수정', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="TodoList"
          component={TodoList}
          options={{title: 'ToDo', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="StockManage"
          component={StockManage}
          options={{title: '재고관리', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="CreateStock"
          component={CreateStock}
          options={{title: '재고생성', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="ViewStock"
          component={ViewStock}
          options={{title: '재고관리', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="ModifyStock"
          component={ModifyStock}
          options={{title: '재고 수정', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="WorkCalendar"
          component={WorkCalendar}
          options={{title: '캘린더', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="CalculateSalaryPresident"
          component={CalculateSalaryPresident}
          options={{title: '급여 계산기', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="CalculateSalaryEmployee"
          component={CalculateSalaryEmployee}
          options={{title: '급여 계산기', headerBackTitle: ' 돌아가기'}}
        />
        <Stack.Screen
          name="ConfigScreen"
          component={ConfigScreen}
          options={{title: '환경설정', headerBackTitle: ' 돌아가기'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
