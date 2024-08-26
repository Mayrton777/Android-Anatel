import React, { useState, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { calculo_R, TER, alcanceTorre } from './funcoes';
import dados from './dados/torre_teste.json'; // Importando o JSON diretamente
import Botoes from './components/Botoes';
import Tabela from './components/Tabela';

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [circleCenter, setCircleCenter] = useState(null);
  const [redCircleCenter, setRedCircleCenter] = useState([]);
  const [redCircleRadius, setRedCircleRadius] = useState(0);
  const [towersData, setTowersData] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: -14.235004,
    longitude: -51.92528,
    latitudeDelta: 30,
    longitudeDelta: 30,
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const data = await alcanceTorre(dados); // Usando os dados importados
        //setTowersData(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleMapPress = ({ nativeEvent }) => {
    const { coordinate } = nativeEvent;
    const nearbyTowers = dados.filter(item => {
      const distance = calculateDistance(
        coordinate.latitude,
        coordinate.longitude,
        parseFloat(item.Latitude),
        parseFloat(item.Longitude)
      );
      return distance <= 5;
    });

    setMarkers([
      {
        key: 'clickedPoint',
        coordinate: coordinate,
        title: 'Ponto clicado',
        description: 'Local onde você clicou no mapa',
        image: require('./assets/pessoa.png'),
      },
      ...nearbyTowers.map((item, index) => ({
        key: `tower_${index}`,
        coordinate: {
          latitude: parseFloat(item.Latitude),
          longitude: parseFloat(item.Longitude)
        },
        title: item.NomeEntidade,
        description: `Endereço: ${item.EnderecoEstacao}, ${item.NomeMunicipio}`,
        image: require('./assets/torre-de-comunicacao.png'),
      }))
    ]);
    setCircleCenter(coordinate);

    if (nearbyTowers.length > 0) {

      setIsTableVisible(true);
      const groupedTowers = groupBy(nearbyTowers, tower => `${tower.Latitude},${tower.Longitude}`);
      
      const filteredData = Object.values(groupedTowers).map(group => {
        if (!Array.isArray(group)) {
            console.error("Group is not an array:", group);
            return [];  // Retorna um array vazio ou faça outra ação conforme necessário
        }
        return group.map(tower => ({
          NomeEntidade: tower.NomeEntidade,
          NumEstacao: tower.NumEstacao,
          EnderecoEstacao: tower.EnderecoEstacao,
          EndComplemento: tower.EndComplemento ? tower.EndComplemento : null,
          SiglaUf: tower.SiglaUf,
          FreqTxMHz: parseFloat(tower.FreqTxMHz),
          GanhoAntena: parseFloat(tower.GanhoAntena),
          PotenciaTransmissorWatts: parseFloat(tower.PotenciaTransmissorWatts),
          Latitude: parseFloat(tower.Latitude),
          Longitude: parseFloat(tower.Longitude),
        }));
      });
      if (filteredData[0] && filteredData[0][0]) {
        console.log("Teste dados: ", filteredData[0][0].Latitude, filteredData[0][0].Longitude);
      } else {
        console.error("Dados de latitude e longitude não encontrados.");
      }

      
      const alcance = calculo_R(filteredData);
      setRedCircleRadius(alcance);
      //console.log("Alcance: ", alcance);
      
      const centers = filteredData.map(tower => ({
        latitude: tower[0].Latitude,
        longitude: tower[0].Longitude,
      }));
      
      setRedCircleCenter(centers);
      
      //console.log("RedCircle: ", centers);
      const dadosTorre = alcanceTorre(filteredData)
      setTowersData(dadosTorre)
      //console.log('Teste dados Torres: ', dadosTorre);
      

      // Atualizar a região do mapa para o ponto clicado com zoom de nível 10
      setRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.1, // Ajuste para o zoom desejado
        longitudeDelta: 0.1, // Ajuste para o zoom desejado
      });
    } else {
      setRedCircleCenter(null);
      setRedCircleRadius(0);
      setIsTableVisible(false);
    }
  };

  const groupBy = (array, keyFunction) => {
    return array.reduce((result, item) => {
      const key = keyFunction(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {});
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distância em km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const renderRays = () => {
    const reversedCenters = [...redCircleCenter].reverse(); // Clonando e revertendo a ordem das coordenadas
    const reversedTowersData = [...towersData].reverse();   // Clonando e revertendo a ordem dos dados das torres
  
    return reversedCenters.map((center, index) => {
      return reversedTowersData.map((ray, rayIndex) => {
        const [r, g, b] = ray.cor;
        const radius = ray.raio;
        const color = `rgba(${r},${g},${b},0.5)`;
  
        return (
          <React.Fragment key={`ray_container_${index}_${rayIndex}`}>
            <Circle
              key={`ray_${rayIndex}`}
              center={center} // Usando o centro do círculo aqui
              radius={radius}
              strokeWidth={1}
              strokeColor={`rgba(${r},${g},${b},0.5)`}
              fillColor={color}
            />
          </React.Fragment>
        );
      });
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Atualiza a região do mapa
        onPress={handleMapPress}
      >
        {markers.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          >
            <Image
              source={marker.image}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
        {circleCenter && (
          <Circle
            center={circleCenter}
            radius={5000} // Exemplo de raio em metros
            strokeWidth={1}
            strokeColor='rgba(0,0,255,0.5)'
            fillColor='rgba(66, 135, 245,0.2)'
          />
        )}
        {redCircleCenter && renderRays()}
      </MapView>
      <View style={styles.legendWrapper}>
        {isTableVisible && <Tabela />}
      </View>
      <Botoes
        updateMapRegion={setRegion}
        resetMapRegion={() => setRegion({
          latitude: -14.235004,
          longitude: -51.92528,
          latitudeDelta: 30,
          longitudeDelta: 30,
        })}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerTextContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 2,
    borderRadius: 4,
  },
  markerText: {
    color: 'white',
  },
  legendWrapper: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'transparent',
    elevation: 0, // Adiciona sombra no Android
    zIndex: 1, // Garante que o componente fica acima do mapa
  },
});

export default App;