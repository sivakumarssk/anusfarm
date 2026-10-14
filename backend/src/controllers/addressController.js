const { getLatLngFromAddress,} = require("../utils/geocode");
const { getDistance,} = require("../utils/distance");
const {addAddress,getAddresses,updateAddress,deleteAddress,selectAddress, getSelectedAddress,} = require("../models/addressModel");

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
// const editAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const id = req.params.id;

//     const {
//       type,
//       address,
//       phone,
//       latitude,
//       longitude,
//     } = req.body;

//     const updated = await updateAddress(
//       id,
//       userId,
//       type,
//       address,
//       phone,
//       latitude,
//       longitude
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Address not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Address updated successfully",
//       address: updated,
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
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


    if (!address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Address and phone are required",
      });
    }


    let lat = latitude;
    let lng = longitude;


    // ==========================================
    // ALWAYS GENERATE LOCATION IF COORDINATES
    // ARE NOT PROVIDED
    // ==========================================

    if (lat == null || lng == null) {

      try {

        const location =
          await getLatLngFromAddress(address);

        lat = location.lat;
        lng = location.lng;

        console.log(
          "EDIT ADDRESS GEOCODE LAT =",
          lat
        );

        console.log(
          "EDIT ADDRESS GEOCODE LNG =",
          lng
        );

      } catch (error) {

        console.log(
          "EDIT ADDRESS GEOCODE ERROR =",
          error
        );

        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid address or use Current Location.",
        });
      }
    }


    // ==========================================
    // CHECK DELIVERY DISTANCE
    // ==========================================

    const FARM_LAT = 16.99514678;
    const FARM_LNG = 79.97594835;

    const distance = getDistance(
      lat,
      lng,
      FARM_LAT,
      FARM_LNG
    );


    console.log(
      "EDIT ADDRESS DISTANCE =",
      distance,
      "KM"
    );


    if (distance > 20) {

      return res.status(400).json({
        success: false,
        message:
          "Sorry! Delivery is available only within 20 km of the farm.",
      });
    }


    const updated = await updateAddress(
      id,
      userId,
      type,
      address,
      phone,
      lat,
      lng
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
// SAVE THE SELECTED ADDRESS
const saveSelectedAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    if (!addressId || !Number.isInteger(Number(addressId))) {
      return res.status(400).json({
        success: false,
        message: "Valid address ID is required",
      });
    }

    const selected = await selectAddress(userId, Number(addressId));

    if (!selected) {
      return res.status(404).json({
        success: false,
        message: "Address not found for this user",
      });
    }

    res.json({
      success: true,
      message: "Selected address saved successfully",
    });
  } catch (error) {
    console.log("SAVE SELECTED ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET THE SELECTED ADDRESS
const fetchSelectedAddress = async (req, res) => {
  try {
    const address = await getSelectedAddress(req.user.id);

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    console.log("GET SELECTED ADDRESS ERROR:", error);
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
  saveSelectedAddress,
  fetchSelectedAddress,
};

