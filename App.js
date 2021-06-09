import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	Button,
	FlatList,
	SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

export default function App() {
	const [selectedValue, setSelectedValue] = useState('kutaisi');
	const [weatherData, setWeatherData] = useState('');
	const [longWeather, setLongWeather] = useState([]);
	const [loading, setLoading] = useState(false);
	const [longLoading, setLongLoading] = useState(false);

	const KEY = '38a6d76ac8606ff662bc27f6bb426cd2';

	//fetch weather data
	const weatherFetch = async () => {
		try {
			const response = await axios(
				`https://api.openweathermap.org/data/2.5/weather?q=${selectedValue}&units=metric&appid=${KEY}`
			);
			setWeatherData(response.data);
			setLoading(true);
			setLongLoading(false);
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
	const renderItem = ({ item }) => {
		const miliseconds = item.dt * 1000;
		const dateObj = new Date(miliseconds);

		return (
			<View style={styles.weatherList}>
				<Text style={styles.dateList}>
					{'თარიღი: ' + dateObj.toLocaleDateString()}
				</Text>
				<Text style={styles.degreeList}>
					{Math.ceil(item.temp.day) + '\xB0'}
				</Text>
				<Text style={styles.mainList}>
					{item.weather.map((item) => item.main)}
				</Text>
			</View>
		);
	};

	useEffect(() => {
		weatherFetch();
	}, [selectedValue]);

	return (
		<SafeAreaView>
			<View style={styles.container}>
				<View style={styles.pickerCont}>
					<Picker
						selectedValue={selectedValue}
						style={styles.picker}
						onValueChange={(itemValue) => setSelectedValue(itemValue)}
					>
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
					<FlatList
						data={longWeather}
						renderItem={renderItem}
						keyExtractor={(item, index) => (Math.random() + index).toString()}
						style={{ paddingBottom: 20 }}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}

//Styles

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	pickerCont: {
		marginVertical: 30,
	},

	picker: {
		height: 100,
		width: 250,
	},
	image: {
		width: 150,
		height: 150,
	},
	title: {
		marginVertical: 10,
		fontSize: 22,
	},
	btn: {
		marginVertical: 10,
	},

	weatherCondition: {
		fontSize: 36,
	},
	degree: {
		marginVertical: 10,
		fontSize: 40,
		fontWeight: 'bold',
	},
	weatherList: {
		flexDirection: 'row',
	},
	dateList: {
		paddingVertical: 10,
		fontSize: 22,
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
});
