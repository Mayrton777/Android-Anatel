import React from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';

const MapViewComponent = ({ mapData, selectedLocation, updateRegion }) => {
  return (
    <MapView
      style={styles.map}
      onPress={updateRegion}
      initialRegion={{
        latitude: -14.235004,
        longitude: -51.92528,
        latitudeDelta: 30,
        longitudeDelta: 30,
      }}
    >
      {mapData.map((data, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: data.latitude,
            longitude: data.longitude
          }}
          title={data.title}
          description={data.description}
        >
          <Image source={require('../assets/images/torre-de-comunicacao.png')} style={{ width: 40, height: 40 }} />
        </Marker>
      ))}
      {selectedLocation && (
        <Circle
          center={selectedLocation}
          radius={5000}
          strokeWidth={1}
          strokeColor='rgba(0,0,255,0.5)'
          fillColor='rgba(66, 135, 245,0.2)'
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapViewComponent;
