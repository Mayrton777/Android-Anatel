import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import MapaScreen from './components/MapaScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ANATEL">
        <Stack.Screen name="ANATEL" component={HomeScreen} />
        <Stack.Screen name="Mapa" component={MapaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
