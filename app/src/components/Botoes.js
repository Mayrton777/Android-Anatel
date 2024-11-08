import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import dados from '../data/UF-MUNICIPIO.json';

// Função para remover acentos
const removeAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const Botoes = ({ updateMapRegion, resetMapRegion, isSearching, setIsSearching, setShowMarkers, setShowCircles}) => {
  const [ufMunicipio, setUfMunicipio] = useState([]);
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [ufSuggestions, setUfSuggestions] = useState([]);
  const [municipioSuggestions, setMunicipioSuggestions] = useState([]);

  console.log("setShowMarkers:", setShowMarkers, setShowCircles);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convertendo os dados para maiúsculas
        const data = dados.map(entry => ({
          ...entry,
          SIGLA_UF: entry.SIGLA_UF.toUpperCase(),
          NOME_MUNICIPIO: entry.NOME_MUNICIPIO.toUpperCase(),
        }));
        setUfMunicipio(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleUfChange = (text) => {
    const ufText = text.toUpperCase().trim(); // Remove espaços em branco
    setUf(ufText); // Convertendo entrada para maiúsculas
    if (ufText.length > 0) {
      // Sugestões de UF
      const suggestions = ufMunicipio
        .map(entry => entry.SIGLA_UF)
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicatas
        .filter(uf => uf.startsWith(ufText));
      setUfSuggestions(suggestions);

      // Sugestões de Municípios baseadas na UF digitada
      const municipios = ufMunicipio
        .filter(entry => entry.SIGLA_UF === ufText)
        .map(entry => entry.NOME_MUNICIPIO);
      setMunicipioSuggestions(municipios);
    } else {
      setUfSuggestions([]);
      setMunicipioSuggestions([]);
    }
  };

  const handleMunicipioChange = (text) => {
    const municipioText = text.toUpperCase();
    setMunicipio(municipioText); // Convertendo entrada para maiúsculas
    if (municipioText.length > 0 && uf.length > 0) {
      const normalizedMunicipioText = removeAcentos(municipioText);

      // Sugestões de Municípios baseadas na UF selecionada
      const suggestions = ufMunicipio
        .filter(entry => entry.SIGLA_UF === uf)
        .filter(entry => removeAcentos(entry.NOME_MUNICIPIO).startsWith(normalizedMunicipioText))
        .map(entry => entry.NOME_MUNICIPIO);
      setMunicipioSuggestions(suggestions);
    } else {
      setMunicipioSuggestions([]);
    }
  };

  const handleButtonPress = () => {
    const ufExists = ufMunicipio.some(entry => entry.SIGLA_UF === uf.toUpperCase());

    if (!ufExists) {
      console.log('UF NÃO EXISTE');
      return;
    }

    const municipioNormalized = removeAcentos(municipio);
    const municipioData = ufMunicipio.find(entry =>
      entry.SIGLA_UF === uf.toUpperCase() &&
      removeAcentos(entry.NOME_MUNICIPIO) === municipioNormalized
    );

    if (municipioData) {
      console.log('MUNICÍPIO EXISTE');
      console.log(`Latitude: ${municipioData.Latitude}, Longitude: ${municipioData.Longitude}`);
      // Atualize a região do mapa
      updateMapRegion({
        latitude: parseFloat(municipioData.Latitude),
        longitude: parseFloat(municipioData.Longitude),
        latitudeDelta: 0.1, // Ajuste para o zoom desejado
        longitudeDelta: 0.1, // Ajuste para o zoom desejado
      });
      setShowMarkers(true);
      setShowCircles(true);
      setIsSearching(true); // Define a busca como ativa
    } else {
      console.log('MUNICÍPIO NÃO EXISTE');
    }
  };

  const handleUfSelect = (selectedUf) => {
    setUf(selectedUf);
    setUfSuggestions([]);
    // Atualizar sugestões de municípios quando a UF for selecionada
    const municipios = ufMunicipio
      .filter(entry => entry.SIGLA_UF === selectedUf)
      .map(entry => entry.NOME_MUNICIPIO);
    setMunicipioSuggestions(municipios);
  };

  const handleSelectOtherMunicipio = () => {
    console.log("Função funciona");
    
    setIsSearching(false); // Define a busca como inativa
    resetMapRegion(); // Reseta a região do mapa
    setUf(''); // Limpa o campo UF
    setMunicipio(''); // Limpa o campo Município
    setUfSuggestions([]); // Limpa as sugestões de UF
    setMunicipioSuggestions([]); // Limpa as sugestões de Município
  };

  return (
    <View style={styles.container}>
      {!isSearching && (
        <View style={styles.inputButtonWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite a UF"
              value={uf}
              onChangeText={handleUfChange}
            />
            {ufSuggestions.length > 0 && (
              <FlatList
                data={ufSuggestions}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => handleUfSelect(item)}>
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>{item}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.suggestionsList}
              />
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite o Município"
              value={municipio}
              onChangeText={handleMunicipioChange}
            />
            {municipioSuggestions.length > 0 && municipio.length > 0 && (
              <FlatList
                data={municipioSuggestions}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => setMunicipio(item)}>
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>{item}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                keyExtractor={(item, index) => index.toString()}
                style={styles.suggestionsList}
              />
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      )}
      {isSearching && (
        <TouchableOpacity style={styles.button} onPress={() => {
          console.log("Botão pressionado, resetando mapa...");
          handleSelectOtherMunicipio();
      }}>
          <Text style={styles.buttonText}>Selecionar Outro Município</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  inputButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'relative',
    width: '35%', // Ajustei a largura para um melhor layout
  },
  input: {
    height: 40,
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'black',
  },
  suggestionsList: {
    position: 'absolute',
    bottom: 40, // Ajustei a posição para exibir a lista de sugestões abaixo do input
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'rgba(250, 200, 0, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10, // Espaço entre o input e o botão
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Botoes;
