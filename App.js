import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, API_KEY } from './src/constant';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import WeatherSearch from './src/components/weatherSearch';
import WeatherInfo from './src/components/weatherInfo';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchWeather = (location) => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}?q=${location}&appid=${API_KEY}`)
      .then((response) => {
        const data = response.data;
        data.visibility /= 1000; // Konversi visibility dari meter ke kilometer
        data.visibility = data.visibility.toFixed(2);
        data.main.temp -= 273.15; // Konversi suhu dari Kelvin ke Celcius
        data.main.temp = data.main.temp.toFixed(2);
        setWeatherData(data);
        setError('');
      })
      .catch((error) => {
        console.log(error);
        setWeatherData(null);
        setError('Lokasi yang dicari tidak ditemukan.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <WeatherSearch searchWeather={searchWeather} />
      {isLoading && <ActivityIndicator size="large" color="#007BFF" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {weatherData && <WeatherInfo weatherData={weatherData} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
