const Location = require('../models/locationModel.js');

exports.update = async (req, res) => {
 let updateData = {
  "city": req.body.city,
  "lat": req.body.lat,
  "lng": req.body.lng
 };
 let locationDetails;
 locationDetails = await Location.findByIdAndUpdate('60fc63e127e34b31db7371c5', updateData, {new:true});
 return res.status(200).json({
  status: true,
  message: "Location has been updated successfully!",
  data: locationDetails
 });
}

exports.search = async (req, res) => {
 let locationDetails;
 locationDetails = await Location.findById('60fc63e127e34b31db7371c5');
 if(locationDetails){
  let distance = calculateDistance(locationDetails.lat, locationDetails.lng, req.body.lat*1, req.body.lng*1);
  let result = distance <= 100 ? true : false;
  return res.status(200).json({
   status: true,
   message: "The distance between two cities are "+distance,
   data: {
    distance,
    result
   }
  });
 }else{
  return res.status(200).json({
   status: false,
   message: "Default location is not set, please contact with admin!",
   data:""
  });
 }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  let R = 6371; // km
  let dLat = degreeToRad(lat2-lat1);
  let dLon = degreeToRad(lon2-lon1);
  lat1 = degreeToRad(lat1);
  lat2 = degreeToRad(lat2);

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  let d = R * c;
  return d;
};

const degreeToRad = Value => {
    return Value * Math.PI / 180;
};