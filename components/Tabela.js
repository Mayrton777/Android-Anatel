import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import color from '../dados/color.json';

const Tabela = () => {
  const colorTable = color;

  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Porcentagem TER</Text>
      <FlatList
        data={colorTable}
        keyExtractor={(item) => item.ter.toString()}
        renderItem={({ item }) => (
          <View style={styles.legendRow}>
            <View style={[styles.colorBox, { backgroundColor: `rgba(${item.color})` }]} />
            <Text style={styles.legendText}>{item.ter}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    maxHeight: 200, // Limita a altura da legenda se necessário
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 255, 0.5)',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
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

export default Tabela;
