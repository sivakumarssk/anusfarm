const { getLatLngFromAddress,} = require("../utils/geocode");
const { getDistance,} = require("../utils/distance");
const {addAddress,getAddresses,updateAddress,deleteAddress,} = require("../models/addressModel");

// Add Address
const createAddress = async (req, res) => {
  try {
   const userId = req.user.id;

console.log("========== CREATE ADDRESS ==========");
console.log("REQ.USER =", req.user);
console.log("USER ID =", userId);
console.log("REQ.BODY =", req.body);
console.log("====================================");

    const {
      type,
      address,
      phone,
      latitude,
      longitude,
    } = req.body;
    console.log("BODY =", req.body);
if (!address || !phone) {
  return res.status(400).json({
    success: false,
    message: "Address and phone are required",
  });
}
let lat = latitude;
let lng = longitude;

// if (lat == null || lng == null) {
//   let location;

//   try {
//     location = await getLatLngFromAddress(address);
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: "Please enter a valid address or use Current Location.",
//     });
//   }

//   lat = location.lat;
//   lng = location.lng;
// }
if (lat == null || lng == null) {
  let location;

  try {
    location = await getLatLngFromAddress(address);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message:
        "Please enter a valid address or use Current Location.",
    });
  }

  lat = location.lat;
  lng = location.lng;

  console.log("========== GEOCODE RESULT ==========");
  console.log("ENTERED ADDRESS =", address);
  console.log("GEOCODE LATITUDE =", lat);
  console.log("GEOCODE LONGITUDE =", lng);
  console.log("====================================");
}

const FARM_LAT = 16.99514678;
const FARM_LNG = 79.97594835;

const distance = getDistance(
  lat,
  lng,
  FARM_LAT,
  FARM_LNG
);
console.log("========== DISTANCE CHECK ==========");
console.log("FARM LAT =", FARM_LAT);
console.log("FARM LNG =", FARM_LNG);
console.log("CUSTOMER LAT =", lat);
console.log("CUSTOMER LNG =", lng);
console.log("DISTANCE =", distance, "KM");
console.log("===================================");
if (distance > 20) {
  return res.status(400).json({
    success: false,
    message: "Sorry! Delivery is available only within 20 km of the farm.",
  });
}


    const newAddress = await addAddress(
      userId,
      type,
      address,
      phone,
      // latitude,
      // longitude
      lat,
  lng
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
  
};

// Get All Addresses
const fetchAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await getAddresses(userId);

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Address
const editAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const {
      type,
      address,
      phone,
      latitude,
      longitude,
    } = req.body;

    const updated = await updateAddress(
      id,
      userId,
      type,
      address,
      phone,
      latitude,
      longitude
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Address
const removeAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    await deleteAddress(id, userId);

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createAddress,
  fetchAddresses,
  editAddress,
  removeAddress,
};