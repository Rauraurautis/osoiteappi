import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";

const API_KEY = "GX9GhQOZHQTGeAwHLtl08c8EHklTTANW"

export default function App() {
  const [address, setAddress] = useState()
  const [region, setRegion] = useState({ latitude: 60.200692, longitude: 24.934302, latitudeDelta: 0.0322, longitudeDelta: 0.0221 })


  const switchLocation = async () => {
    const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`)
    const data = await response.json()
    const latLng = data.results[0].locations[0].latLng
    setRegion({ ...region, latitude: latLng.lat, longitude: latLng.lng })
    setAddress("")
  }

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        region={region}
      >
        <Marker coordinate={{ latitude: 60.201373, longitude: 24.934041 }} title='Haaga-Helia' />
      </MapView>
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
