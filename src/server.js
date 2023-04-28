const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
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

/*app.post("/save-temp", (req, res) => {
  //let firstTemp = req.currentWeather.temperature;
  res.send("Hello world!");
  console.log(req);
  console.log("Data received");
});*/

const db = 'mongodb+srv://kirildora02:Pass123@cluster0.vpqfqrp.mongodb.net/?retryWrites=true&w=majority';

mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then((res) => console.log('Connected to DB'))
.catch((error) => console.log(error));

app.post('/save-temp', (req, res) => {
  const { tempApiOne, tempApiTwo, tempApiThree } = {
    tempApiOne: req.body.currentWeather.temperature, 
    tempApiTwo: req.body.currentWeatherNinjaApi.temperature, 
    tempApiThree: req.body.currentWeatherAIApi.temperature};
  const weather = new Weather({ tempApiOne, tempApiTwo, tempApiThree });
  weather
    .save()
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      //res.render(createPath('error'), { title: 'Error' });
    })
});

app.listen(PORT, ()=> {console.log("App listening on port 3000");});