const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
 city: { 
  type: String, 
  required: [true,'City is required']
 },
 lat: { 
  type: Number, 
  required: [true, 'Latitude should be a number']
 },
 lng: { 
  type: Number, 
  required: [true, 'Longitude should be a number']
 },
});

const Location = mongoose.model('locations',locationSchema);
module.exports = Location;