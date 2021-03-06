import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        const ufInitials = response.data.map(item => item.sigla);

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (!uf){
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(item => item.nome);
        setCities(cityNames);
        setCity('');
      });
  }, [uf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf, city,
    });
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

      </View>

      <View style={styles.footer}>
        <RNPickerSelect 
          onValueChange={(value) => {
            if (value !== null)
              setUf(value);
          }}
          disabled={ufs.length === 0}
          items={ufs.map((u) => ({ label: u, value: u, key: u }))}
          value={uf}
          placeholder={{label: 'Selecione a UF', value: null}}
        />
        <RNPickerSelect 
          disabled={!uf}
          onValueChange={(value) => {
            if (value !== null)
            setCity(value);
          }}
          items={cities.map((c) => ({ label: c, value: c, key: c }))}
          value={city}
          placeholder={{label: 'Selecione a cidade', value: null}}
        />
        { /*<TextInput 
          style={styles.input}
          placeholder="Digite a UF"
          value={uf}
          maxLength={2}
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={setUf}
        />
        <TextInput 
          style={styles.input}
          placeholder="Digite a cidade"
          value={city}
          autoCorrect={false}
          onChangeText={setCity}
        /> */}

        <RectButton 
          style={styles.button} 
          onPress={() => { if(city) return handleNavigateToPoints()}}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>

      </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;