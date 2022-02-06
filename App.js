import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"

const LOCATION_API_KEY = "GX9GhQOZHQTGeAwHLtl08c8EHklTTANW"
const RESTAURANTS_API_KEY = "DyDjeja69FYVYUTQuaf4IRXi3XimzTKd"

export default function App() {
  const [address, setAddress] = useState()
  const [region, setRegion] = useState()
  const [restaurants, setRestaurants] = useState()

  const getNearbyRestaurants = async (lat, lon) => {
    const response = await fetch(`https://api.tomtom.com/search/2/categorySearch/restaurant.json?key=${RESTAURANTS_API_KEY}&lat=${lat}&lon=${lon}&limit=20`)
    const data = await response.json()
    setRestaurants(data.results)
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("No permission to get current location")
        setRegion({ latitude: 59.9795585, longitude: 25.4483983, latitudeDelta: 0.0322, longitudeDelta: 0.0221 })
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({})
      const coords = { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude }
      setRegion({ ...coords, latitudeDelta: 0.0322, longitudeDelta: 0.0221 })
      getNearbyRestaurants(coords.latitude, coords.longitude)
    })();
  }, [])

  const switchLocation = async () => {
    const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${LOCATION_API_KEY}&location=${address},FI`)
    const data = await response.json()
    const latLng = data.results[0].locations[0].latLng
    setRegion({ ...region, latitude: latLng.lat, longitude: latLng.lng })
    getNearbyRestaurants(latLng.lat, latLng.lng)
    setAddress("")
  }

  return (
    <>
      {region && <MapView
        style={{ flex: 1 }}
        region={region}
      >
        {restaurants !== undefined && restaurants.map((restaurant, index) => {
          return <Marker key={index} coordinate={{ latitude: restaurant.position.lat, longitude: restaurant.position.lon }} title={restaurant.poi.name} description={restaurant.address.freeformAddress} />
        })}
      </MapView>}
      <View style={styles.container}>
        <TextInput style={styles.input} onChangeText={text => setAddress(text)} value={address} placeholder="Address here" />
        <Button title="SHOW" onPress={() => switchLocation()} />
      </View>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  input: {
    width: "50%",
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    padding: 1
  }
});
