import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { calculo_R, alcanceTorre } from '../utils/funcoes';
import dados from '../data/torre_teste.json';
import Botoes from './Botoes';
import Tabela from './Tabela';

const MapaScreen = () => {
    const [markers, setMarkers] = useState([]);
    const [circleCenter, setCircleCenter] = useState(null);
    const [redCircleCenter, setRedCircleCenter] = useState([]);
    const [redCircleRadius, setRedCircleRadius] = useState(0);
    const [towersData, setTowersData] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [showMarkers, setShowMarkers] = useState(false);
    const [showCircles, setShowCircles] = useState(false);
    const [region, setRegion] = useState({
        latitude: -14.235004,
        longitude: -51.92528,
        latitudeDelta: 30,
        longitudeDelta: 30,
    });
    const [isSearching, setIsSearching] = useState(false);

    const handleMapPress = ({ nativeEvent }) => {
        if (!showMarkers) return; // Não faz nada se os pontos não devem ser mostrados
    
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
                image: require('../assets/images/pessoa.png'),
            },
            ...nearbyTowers.map((item, index) => ({
                key: `tower_${index}`,
                coordinate: {
                    latitude: parseFloat(item.Latitude),
                    longitude: parseFloat(item.Longitude),
                },
                title: item.NomeEntidade,
                description: `Endereço: ${item.EnderecoEstacao}, ${item.NomeMunicipio}`,
                image: require('../assets/images/torre-de-comunicacao.png'),
            })),
        ]);
    
        setCircleCenter(coordinate);
    
        if (nearbyTowers.length > 0) {
            setIsTableVisible(true);
    
            const groupedTowers = groupBy(nearbyTowers, tower => `${tower.Latitude},${tower.Longitude}`);
            const filteredData = Object.values(groupedTowers).map(group => 
                group.map(tower => ({
                    NomeEntidade: tower.NomeEntidade,
                    NumEstacao: tower.NumEstacao,
                    EnderecoEstacao: tower.EnderecoEstacao,
                    EndComplemento: tower.EndComplemento || null,
                    SiglaUf: tower.SiglaUf,
                    FreqTxMHz: parseFloat(tower.FreqTxMHz),
                    GanhoAntena: parseFloat(tower.GanhoAntena),
                    PotenciaTransmissorWatts: parseFloat(tower.PotenciaTransmissorWatts),
                    Latitude: parseFloat(tower.Latitude),
                    Longitude: parseFloat(tower.Longitude),
                }))
            );
    
            const alcance = calculo_R(filteredData);
            setRedCircleRadius(alcance);
    
            const centers = filteredData.map(tower => ({
                latitude: tower[0].Latitude,
                longitude: tower[0].Longitude,
            }));
    
            setRedCircleCenter(centers);
    
            const dadosTorre = alcanceTorre(filteredData);
            console.log(dadosTorre);
            
            setTowersData(dadosTorre);
    
            setRegion({
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        } else {
            setRedCircleCenter([]);
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
        return R * c; // Distância em km
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
                    <Circle
                        key={`ray_${index}_${rayIndex}`}
                        center={center}
                        radius={radius}
                        strokeWidth={1}
                        strokeColor={`rgba(${r},${g},${b},0.5)`}
                        fillColor={color}
                    />
                );
            });
        });
    };

    const resetMapRegion = () => {
        // Reseta o mapa para a posição inicial ou um zoom out total
        setRegion({
            latitude: -14.235004,
            longitude: -51.92528,
            latitudeDelta: 30,
            longitudeDelta: 30,
        });
        // Remove todos os pontos do mapa e círculos
        setMarkers([]);
        setCircleCenter(null);
        setRedCircleCenter([]);
        setRedCircleRadius(0);
        setIsTableVisible(false); // Opcional: se você deseja ocultar a tabela também
        setShowMarkers(false);
        setShowCircles(false);

        console.log("Region resetada:", region);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
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
                        radius={5000} // Raio em metros
                        strokeWidth={1}
                        strokeColor='rgba(0,0,255,0.5)'
                        fillColor='rgba(66, 135, 245,0.2)'
                    />
                )}
                {redCircleCenter.length > 0 && renderRays()}
            </MapView>
            <View style={styles.legendWrapper}>
                {isTableVisible && <Tabela />}
            </View>
            <Botoes
                updateMapRegion={setRegion}
                resetMapRegion={resetMapRegion} // Corrigido: passando a função corretamente
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                setShowMarkers={setShowMarkers}
                setShowCircles={setShowCircles}
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
    legendWrapper: {
        position: 'absolute',
        top: 50,
        left: 10,
        backgroundColor: 'transparent',
        elevation: 0, // Sombra no Android
        zIndex: 1, // Garante que o componente fica acima do mapa
    },
});

export default MapaScreen;
