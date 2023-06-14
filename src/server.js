const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Weather = require('./weather.js');
const cors = require('cors');

const PORT = 3000;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const db = 'mongodb+srv://kirildora02:Pass123@cluster0.vpqfqrp.mongodb.net/?retryWrites=true&w=majority';

mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then((res) => console.log('Connected to DB'))
.catch((error) => console.log(error));

app.post('/save-temp', (req, res) => {
  const { tempApiOne, tempApiTwo, tempApiThree, city } = {
    tempApiOne: req.body.currentWeather.temperature, 
    tempApiTwo: req.body.currentWeatherNinjaApi.temperature, 
    tempApiThree: req.body.currentWeatherAIApi.temperature,
    city: req.body.currentWeather.city
  };
  const weather = new Weather({ tempApiOne, tempApiTwo, tempApiThree, city});
  weather
    .save()
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
    })
});

app.get(`/draw-chart`, (req, res) => {
  let city = req.query.city;
  console.log("location have got from ui");
  console.log(city);

  if(city) {
    Weather
    .find({'city': city})
    .then((data) => {
      console.log("Data we got from db");
      console.log(data);
      const dataToSend = {
        labels: data.map((item) => item.date.toString().slice(0,10)),
        datasets: [
          {
            label: "Weather API",
            data: data.map((item) => item.tempApiOne),
            borderColor: ['rgba(255, 165, 0, 1)']
          },
          {
            label: "Ninja API",
            data: data.map((item) => item.tempApiTwo),
            borderColor: ['rgba(0, 0, 148, 1)']
          },
          {
            label: "AI Weather API",
            data: data.map((item) => item.tempApiThree),
            borderColor: ['rgba(75, 192, 192, 1)']
          }
        ] 
      }
      console.log("Data we converted to send to ui");
      console.log(dataToSend);
      res.send(dataToSend);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  else
    console.log("There is no such data about chosen city");
  
});

app.listen(PORT, ()=> {console.log("App listening on port 3000");});