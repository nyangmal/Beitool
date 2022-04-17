import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {NativeBaseProvider, Box, Button, useToast} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import haversine from 'haversine-distance';

function CommuteScreen() {
  const [buttonAv, setButtonAv] = useState(true);
  const [userRegion, setUserRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0001,
    longitudeDelta: 0.0001,
  });
  const [placeRegion, setPlaceRegion] = useState({
    //값 바꿔야함
    latitude: 36.4859522,
    longitude: 127.256717,
  });

  const ShowToast = () => {
    const toast = useToast();
    return (
      <Button.Group
        style={{position: 'absolute', bottom: 100}}
        isAttached
        size="lg"
        colorScheme="blue"
        mx={{base: 'auto', md: 0}}>
        <Button
          disabled={!buttonAv}
          colorScheme={buttonAv === true ? 'primary' : 'primary'}
          onPress={() => {
            getPosition();
            calculateDistance() === true
              ? console.log('허용')
              : toast.show({
                  title: '가게와 너무 멀리 떨어져 있습니다',
                  placement: 'bottom',
                });
          }}>
          출근하기
        </Button>
        <Button
          disabled={buttonAv}
          colorScheme={buttonAv === true ? 'gray' : 'primary'}
          onPress={() => {}}>
          퇴근하기
        </Button>
      </Button.Group>
    );
  };

  const getPlaceRegion = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    fetch('http://52.79.203.173:8080/map/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(token.accessToken),
    })
      .then(res => res.json())
      .then(res => {
        setPlaceRegion({...res}); //res 처리 바꿔야함
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const calculateDistance = () => {
    const userPosition = {
      latitude: userRegion.latitude,
      longitude: userRegion.longitude,
    };
    const tempNum = 500; //출근 허용 거리
    return haversine(placeRegion, userPosition) < tempNum ? true : false;
  };

  const getPosition = () => {
    Geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      const tempObj = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setUserRegion({...tempObj});
    });
  };

  useEffect(() => {
    getPlaceRegion();
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    getPosition();
  }, []);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <MapView
          ref={ref => (this.mapView = ref)}
          flex={1}
          width="100%"
          height="100%"
          initialRegion={{
            latitude: 127,
            longitude: 37,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onMapReady={() => {
            this.mapView.animateToRegion(userRegion, 0);
          }}
          showsUserLocation={true}>
          <Marker //가게 위치로 바꿔줘야함
            coordinate={{
              latitude: userRegion.latitude,
              longitude: userRegion.longitude,
            }}
          />
        </MapView>
        <ShowToast />
      </Box>
    </NativeBaseProvider>
  );
}

export default CommuteScreen;
