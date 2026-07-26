const { saveLocation } = require("../models/locationModel");

const addLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const location = await saveLocation(
      req.user.id,
      latitude,
      longitude,
      address
    );

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

module.exports = {
  addLocation,
};