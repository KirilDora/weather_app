import { useState } from 'react';
import './App.css';
import { WEATHER_API_URL, WEATHER_API_KEY, WEATHER_API_NINJA_URL, weatherNinjaApiOptions, WEATHER_API_VISUALCROSSING_URL, weatherVisualCrossingApiOptions } from './api';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import Forecast from './components/forecast/forecast';

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [currentWeatherVisualCrossingApi, setCurrentWeatherVisualCrossingApi] = useState(null);
  const [currentWeatherNinjaApi, setCurrentWeatherNinjaApi] = useState(null);

  const firstApiData = {};
  const secondApiData = {};
  //var thirdApiData = {};

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
        const forecastResponse = await response[1].json();

        const weatherResponseNinja = await response[2].json();
        const weatherResponseVisualCrossing= await response[3].json();
        
        setCurrentWeather({ city: searchData.label, ...weatherResponse});
        setForecast({ city: searchData.label, ...forecastResponse});

        Object.defineProperties( firstApiData, {
          city: searchData.label, 
          description: currentWeather.weather[0].description,
          icon: currentWeather.weather[0].icon,
          temperature: currentWeather.main.temp,
          feels_like: currentWeather.feels_like,
          wind_speed: currentWeather.wind.speed,
          humidity: currentWeather.main.humidity,
          pressure: currentWeather.main.pressure
        });

        setCurrentWeatherNinjaApi({ city: searchData.label, ...weatherResponseNinja});

        Object.defineProperties( secondApiData , {
          city: searchData.label, 
          description: "No such data in API",
          icon: "No such data in API",
          temperature: weatherResponseNinja.temp,
          feels_like: weatherResponseNinja.feels_like,
          wind_speed: weatherResponseNinja.wind_speed,
          humidity: weatherResponseNinja.humidity,
          pressure: "No such data in API"
        });

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
  console.log(firstApiData);
  console.log("ObjectData from second Api");
  console.log(secondApiData);

  return (
    <div className="container">
      < Search onSearchChange={handleOnSearchChange} />

      <div className="container__daily-weather">
        {currentWeather && < CurrentWeather data={firstApiData} />}
        {currentWeatherNinjaApi && < CurrentWeather data={secondApiData} />}
        {currentWeather && < CurrentWeather data={firstApiData} />}
      </div>

      {forecast && < Forecast data={forecast} />}
    </div>
  );
}

export default App;
