import { useState } from 'react';
import './App.css';
import { WEATHER_API_URL, WEATHER_API_KEY, WEATHER_API_NINJA_URL, weatherNinjaApiOptions, WEATHER_API_VISUALCROSSING_URL, weatherVisualCrossingApiOptions } from './api';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import Forecast from './components/forecast/forecast';

const decodeCurrentWeatherResponse = (response, city) => {
 return {
  city: city.label, 
  description: response.weather[0].description,
  icon: response.weather[0].icon,
  temperature: response.main.temp,
  feels_like: response.main.feels_like,
  wind_speed: response.wind.speed,
  humidity: response.main.humidity,
  pressure: response.main.pressure
 }
}

const decodeCurrentWeatherNinjaResponse = (response, city) => {
  return {
    city: city.label, 
    description: "No such data in API",
    icon: "unknown",
    temperature: response.temp,
    feels_like: response.feels_like,
    wind_speed: response.wind_speed,
    humidity: response.humidity,
    pressure: "No such data in API"
  }
 }

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [currentWeatherNinjaApi, setCurrentWeatherNinjaApi] = useState(null);
  const [currentWeatherVisualCrossingApi, setCurrentWeatherVisualCrossingApi] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon]  = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    const currentWeatherNinjaApiFetch = fetch(`${WEATHER_API_NINJA_URL}/weather?lat=${lat}&lon=${lon}`, weatherNinjaApiOptions);

    const currentWeatherVisualCrossingApi = fetch(`${WEATHER_API_VISUALCROSSING_URL}/find_places?text=${searchData.label}&language=en`, weatherVisualCrossingApiOptions);

    Promise.all([
      currentWeatherFetch, 
      forecastFetch, 
      currentWeatherNinjaApiFetch, 
      currentWeatherVisualCrossingApi])
      .then(async (response) => {
        console.log(response);
        const weatherResponse = await response[0].json();
        console.log("WEATHER API response");
        console.log(weatherResponse);
        const forecastResponse = await response[1].json();

        const weatherResponseNinja = await response[2].json();
        const weatherResponseVisualCrossing= await response[3].json();
        
        setCurrentWeather(decodeCurrentWeatherResponse(weatherResponse, searchData));
        setForecast({ city: searchData.label, ...forecastResponse});

        setCurrentWeatherNinjaApi(decodeCurrentWeatherNinjaResponse(weatherResponseNinja, searchData));

        setCurrentWeatherVisualCrossingApi({ city: searchData.label, ...weatherResponseVisualCrossing });
      })
      .catch((err)=> console.log(err));

  }

  console.log("WEATHER API");
  console.log(currentWeather);
  console.log("CurrentWeatherNinjaApi");
  console.log(currentWeatherNinjaApi);
  console.log("AI API");
  console.log(currentWeatherVisualCrossingApi);

  console.log("ObjectData from first Api");
  console.log(currentWeather);
  console.log("ObjectData from second Api");
  console.log(currentWeatherNinjaApi);

  return (
    <div className="container">
      < Search onSearchChange={handleOnSearchChange} />

      <div className="container__daily-weather">
        {currentWeather && < CurrentWeather data={currentWeather} />}
        {currentWeatherNinjaApi && < CurrentWeather data={currentWeatherNinjaApi} />}
        {currentWeather && < CurrentWeather data={currentWeather} />}
      </div>

      {forecast && < Forecast data={forecast} />}
    </div>
  );
}

export default App;
