import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {NativeBaseProvider, Box, Button, useToast} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import haversine from 'haversine-distance';

function CommuteScreen() {
  let workType = '';
  let commuteDistance = 500;
  let commuteSuccess = false;
  const [buttonAv, setButtonAv] = useState(true);
  const [userRegion, setUserRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const [placeRegion, setPlaceRegion] = useState({
    latitude: 0,
    longitude: 0,
  });

  const doCommute = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    const commuteData = await JSON.stringify({
      workType: workType,
      accessToken: token.accessToken,
    });
    await fetch('http://52.79.203.173:8080/work/commute/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: commuteData,
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'Success') {
          commuteSuccess = true;
          setButtonAv(!buttonAv);
        } else commuteSuccess = false;
      })
      .catch(err => {
        console.log(err.message);
      });
  };

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
          colorScheme={buttonAv === true ? 'primary' : 'gray'}
          onPress={() => {
            getPosition();
            workType = 'onWork';
            if (calculateDistance() === true) {
              doCommute().then(() => {
                commuteSuccess === true
                  ? toast.show({title: '출근 성공', placement: 'bottom'})
                  : console.log('failed');
              });
            } else {
              toast.show({
                title: '가게와 너무 멀리 떨어져 있습니다',
                placement: 'bottom',
              });
            }
          }}>
          출근하기
        </Button>
        <Button
          disabled={buttonAv}
          colorScheme={buttonAv === true ? 'gray' : 'primary'}
          onPress={() => {
            getPosition();
            workType = 'offWork';
            if (calculateDistance() === true) {
              doCommute().then(() => {
                commuteSuccess === true
                  ? toast.show({title: '퇴근 성공', placement: 'bottom'})
                  : console.log('failed');
              });
            } else {
              toast.show({
                title: '가게와 너무 멀리 떨어져 있습니다',
                placement: 'bottom',
              });
            }
          }}>
          퇴근하기
        </Button>
      </Button.Group>
    );
  };

  const getPlaceRegion = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('kakaoToken'));
    fetch('http://52.79.203.173:8080/store/map/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(token.accessToken),
    })
      .then(res => res.json())
      .then(res => {
        commuteDistance = res.allowDistance;
        res.message === 'working' ? setButtonAv(false) : setButtonAv(true);
        const tempObj = {latitude: res.latitude, longitude: res.longitude};
        setPlaceRegion({...tempObj});
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
    return haversine(placeRegion, userPosition) < commuteDistance
      ? true
      : false;
  };

  const getPosition = () => {
    Geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords;
      const tempObj = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      };
      setUserRegion({...tempObj});
    });
  };

  useEffect(() => {
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
            getPlaceRegion();
            this.mapView.animateToRegion(userRegion, 0);
          }}
          showsUserLocation={true}>
          <Marker
            coordinate={{
              latitude: placeRegion.latitude,
              longitude: placeRegion.longitude,
            }}
          />
        </MapView>
        <ShowToast />
      </Box>
    </NativeBaseProvider>
  );
}

export default CommuteScreen;
