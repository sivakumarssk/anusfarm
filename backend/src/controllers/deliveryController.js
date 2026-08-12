const { getDeliveryLocation } = require("../models/deliveryModel");

// Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const checkDelivery = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const deliveryHub = await getDeliveryLocation();

    if (!deliveryHub) {
      return res.status(404).json({
        success: false,
        message: "Delivery location not configured",
      });
    }

    const distance = calculateDistance(
      Number(latitude),
      Number(longitude),
      Number(deliveryHub.latitude),
      Number(deliveryHub.longitude)
    );

    if (distance <= deliveryHub.radius_km) {
      return res.json({
        success: true,
        available: true,
        distance: distance.toFixed(2),
        message: "Delivery Available",
      });
    }

    return res.json({
      success: true,
      available: false,
      distance: distance.toFixed(2),
      message: `Delivery is available only within ${deliveryHub.radius_km} KM of Kodad.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  checkDelivery,
};