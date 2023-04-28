const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
  tempApiOne: {
      type: Number,
      required: true,
  },
  tempApiTwo: {
      type: Number,
      required: true,
  },
  tempApiThree: {
      type: Number,
      required: true,
  },
  date: {
      type: Date,
      default: Date.now
  }
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;