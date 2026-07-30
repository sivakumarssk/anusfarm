const {saveLocation,getLocationByUserId,} = require("../models/locationModel");

const addLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const location = await saveLocation(req.user.id,latitude,longitude,address);
    res.status(201).json({
      success: true,
      message: "Location saved successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getLocation = async (req, res) => {
  try {
    const location = await getLocationByUserId(req.user.id);
    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addLocation,
  getLocation,
};