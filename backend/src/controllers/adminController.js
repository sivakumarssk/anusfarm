const { getLatestOrders,getLatestUsers, getLowStockProducts} = require("../models/adminModel");

const getNotifications = async (req, res) => {
  try {
    const orders = await getLatestOrders();
    const users = await getLatestUsers();
    const lowStock = await getLowStockProducts();
    res.json({success: true,orders,users,lowStock});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  getNotifications
};