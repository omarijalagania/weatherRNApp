import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Loader from './components/Loader';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

export default function App() {
  const [selectedValue, setSelectedValue] = useState('kutaisi');
  const [weatherData, setWeatherData] = useState('');
  const [longWeather, setLongWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false);
  const [loader, setLoader] = useState('false');

  const KEY = '38a6d76ac8606ff662bc27f6bb426cd2';

  //fetch weather data
  const weatherFetch = async () => {
    setLoader(true);
    try {
      const response = await axios(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedValue}&units=metric&appid=${KEY}`
      );

      setWeatherData(response.data);
      setLoading(true);
      setLongLoading(false);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch weather data for 7 days
  const fetchLongWeather = async (e) => {
    try {
      const response = await axios(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${KEY}`
      );
      setLongWeather(response.data.daily);
      if (longWeather) {
        setLongLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //render items for flatList

  useEffect(() => {
    weatherFetch();
  }, [selectedValue]);

  return (
    <SafeAreaView>
      <ImageBackground
        source={{ uri: 'https://wallpapercave.com/wp/wp7168094.png' }}
        style={styles.backImage}>
        <View style={styles.container}>
          <View style={styles.pickerCont}>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}>
              <Picker.Item label='Kutaisi' value='Kutaisi' />
              <Picker.Item label='Tbilisi' value='Tbilisi' />
              <Picker.Item label='Batumi' value='Batumi' />
            </Picker>
          </View>
          <Text style={styles.weatherCondition}>
            {loading && weatherData.weather[0].main}
          </Text>
          <Text style={styles.degree}>
            {loading && Math.ceil(weatherData.main.temp) + '\xB0'}
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: `http://openweathermap.org/img/wn/${
                loading && weatherData.weather[0].icon
              }.png`,
            }}
          />
          <Text style={styles.title}>Forecast For 7 Days</Text>
          <View style={styles.btn}>
            <Button title={selectedValue} onPress={() => fetchLongWeather()} />
          </View>
          {longLoading && (
            // <FlatList
            //   style={styles.flatStyle}
            //   data={longWeather}
            //   renderItem={renderItem}
            //   keyExtractor={(item, index) =>
            //     (Math.random() + index).toString()
            //   }
            //   horizontal
            // />
            <ScrollView style={styles.scrollText}>
              {longWeather.map((item, index) => {
                const miliseconds = item.dt * 1000;
                const dateObj = new Date(miliseconds);

                return (
                  <View style={styles.weatherList} key={index + Math.random()}>
                    <Text style={styles.dateList}>
                      {dateObj.toLocaleDateString(window.navigator.language, {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text style={styles.degreeList}>
                      {Math.ceil(item.temp.day) + '\xB0'}
                    </Text>
                    <Image
                      style={styles.icon}
                      source={{
                        uri: `http://openweathermap.org/img/wn/${
                          loading &&
                          weatherData.weather.map((item) => item.icon)
                        }.png`,
                      }}
                    />
                    <Text style={styles.mainList}>
                      {item.weather.map((item) => item.main)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

//Styles

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  icon: {
    width: 50,
    height: 50,
  },
  pickerCont: {
    marginVertical: 30,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
  },

  picker: {
    height: 70,
    width: 250,
    color: 'white',
    fontSize: 45,
  },
  inputText: {
    backgroundColor: 'white',
    padding: 10,
    fontSize: 20,
    borderRadius: 5,
    minWidth: '75%',
    marginTop: 50,
  },

  image: {
    width: 150,
    height: 150,
  },
  title: {
    marginVertical: 10,
    fontSize: 22,
    color: 'white',
  },
  btn: {
    marginVertical: 10,
  },

  weatherCondition: {
    fontSize: 36,
    color: 'white',
  },
  degree: {
    marginVertical: 10,
    fontSize: 70,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateList: {
    paddingVertical: 10,
    fontSize: 22,
    flexDirection: 'row',
  },

  degreeList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  mainList: {
    paddingVertical: 10,
    fontSize: 22,
  },
  scrollText: {
    width: '90%',
  },
});
