const {saveLocation,getLocationByUserId,} = require("../models/locationModel");
const pool = require("../config/db");

const addLocation = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;
        const userId = req.user.id;

        // Save/update current location
        const location = await saveLocation(
            userId,
            latitude,
            longitude,
            address
        );

        // Update the user's existing address coordinates/address
        await pool.query(
            `
            UPDATE addresses
            SET
                full_address = $1,
                latitude = $2,
                longitude = $3
            WHERE user_id = $4
            `,
            [
                address,
                latitude,
                longitude,
                userId
            ]
        );

        res.status(201).json({
            success: true,
            message: "Location saved successfully",
            location,
        });

    } catch (error) {
        console.error("SAVE LOCATION ERROR:", error);

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