import { useEffect, useState } from 'react';
import './App.css';
import { 
  WEATHER_API_URL, 
  WEATHER_API_KEY, 
  WEATHER_API_NINJA_URL, 
  weatherNinjaApiOptions, 
  WEATHER_API_AI_URL, 
  weatherAIApiOptions } from './api';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import Forecast from './components/forecast/forecast';
import LineChart from './components/chart/line-chart';
import MultiLineChart from './components/chart/multi-line-chart';


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

/*const convertResponseiconToDefined = (icon) => {
  switch (icon) {
    case 'mostly_cloud':
      return '03d';
      break;
    case 'overcast':
      return '04d';
      break;
    default:
      break;
  }
}*/

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

const decodeCurrentWeatherAIResponse = (response, city) => {
  return {
    city: city.label, 
    description: response.current.summary,
    icon: "unknown",
    temperature: response.current.temperature,
    feels_like: response.current.feels_like,
    wind_speed: response.current.wind.speed,
    humidity: response.current.humidity,
    pressure: response.current.pressure
  }
}

const decodeFetchTemperatureResponse = (response) => {
  const labelsName = [],
        dataFirst = [],
        dataSecond = [],
        dataThird = [];
  let i = 0;

  for (const item of response) {
    i++;
    labelsName.push(i);
    //labelsName.push(item.date.slice(0,10));
    dataFirst.push(item.tempApiOne);
    dataSecond.push(item.tempApiTwo);
    dataThird.push(item.tempApiThree);
  }
  
  return {
      labels: labelsName,//response.map((item) => item.date),
      datasets: [
        {
          label: "Weather API",
          data: dataFirst,//response.map((item) => item.tempApiOne),
          backgroundColor: ['f3ba2f']
        },
        {
          label: "Ninja API",
          data: dataSecond,//response.map((item) => item.tempApiTwo),
          backgroundColor: ['2a71d0']
        },
        {
          label: "AI Weather API",
          data: dataThird,//response.map((item) => item.tempApiThree),
          backgroundColor: ['rgba(75, 192, 192, 1)']
        }
      ] 
  }
}

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [tempData, setTempData] = useState(null);
  /*({
    labels: [1, 2],
    datasets:[{
      label:'gained',
      data:[3,4],
    },
  ]
  });*/

  const [currentWeatherNinjaApi, setCurrentWeatherNinjaApi] = useState(null);
  const [currentWeatherAIApi, setCurrentWeatherAIApi] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon]  = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    const currentWeatherNinjaApiFetch = fetch(`${WEATHER_API_NINJA_URL}/weather?lat=${lat}&lon=${lon}`, weatherNinjaApiOptions);

    const currentWeatherAIApi = fetch(`${WEATHER_API_AI_URL}/current?lat=${lat}&lon=${lon}&timezone=auto&language=en&units=metric`, weatherAIApiOptions);

    Promise.all([
      currentWeatherFetch, 
      forecastFetch, 
      currentWeatherNinjaApiFetch, 
      currentWeatherAIApi])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        const weatherResponseNinja = await response[2].json();
        const weatherResponseAI = await response[3].json();

        console.log("New API response");
        console.log(weatherResponseAI);
        
        setCurrentWeather(decodeCurrentWeatherResponse(weatherResponse, searchData));
        setForecast({ city: searchData.label, ...forecastResponse});

        setCurrentWeatherNinjaApi(decodeCurrentWeatherNinjaResponse(weatherResponseNinja, searchData));

        setCurrentWeatherAIApi(decodeCurrentWeatherAIResponse(weatherResponseAI, searchData));
      })
      .catch((err)=> console.log(err));

  }

 const handleOnClickSave = async (e) => {
    e.preventDefault();
    let result = await fetch(
    'http://localhost:3000/save-temp', {
        method: "post",
        body: JSON.stringify({ currentWeather, currentWeatherNinjaApi, currentWeatherAIApi }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    result = await result.json();
    console.warn(result);
    if (result) {
        alert("Data saved succesfully");
    }
  }

  const handleOnClickDraw = (e) => {
    e.preventDefault();
    const temperatureFetch = fetch(
    'http://localhost:3000/draw-chart')
    .then((response)=>{return response.json()})
    .then((data)=>{
      if(data){
        alert("Data got from server");
        setTempData(data);
        console.log("State value is");
        console.log(tempData);
      }
      else
        alert('Something went wrong!');
    })
    .catch((err)=>console.log(err));
    /*const tempResponse = await temperatureFetch.json();
    //let data = Object.entries(dataSecond);
    console.log("Data from server");
    console.log(tempResponse);
    console.warn(tempResponse);
    if (tempResponse) {
      alert("Data got from server");
      setTempData(tempResponse);
    }
    else
      alert('Something went wrong!');*/

    /*Promise.all([temperatureFetch])
    .then( async (result) => {
      const tempResponse = await result[0].json();
      console.log("Async response");
      console.log(tempResponse);
      console.log("Type of Res");
      console.log(typeof(tempResponse));

      //setTempData((temp) => Object.assign({}, temp, tempResponse));
      setTempData(tempResponse);//decodeFetchTemperatureResponse(tempResponse));

      console.log('Temperature state equal');
      console.log(tempData);
    })
    .catch((err) => console.log(err));*/
  }

  useEffect(()=>{
    console.log("useEffect");
    console.log(tempData);
  }, [tempData])

  return (
    <div className="container">
      < Search onSearchChange={handleOnSearchChange} />
      <div className='container__button-group'>
        <button onClick={handleOnClickSave}>
          Save current temperature
        </button>
        <button onClick={handleOnClickDraw}>
          Draw chart
        </button>
      </div>
      <div className="container__daily-weather">
        {currentWeather && < CurrentWeather data={currentWeather} />}
        {currentWeatherNinjaApi && < CurrentWeather data={currentWeatherNinjaApi} />}
        {currentWeatherAIApi && < CurrentWeather data={currentWeatherAIApi} />}
      </div>

      {forecast && < Forecast data={forecast} />}

      {tempData && < LineChart data={tempData} />}
      
    </div>
  );
}

export default App;
