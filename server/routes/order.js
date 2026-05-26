const express = require('express');
const router = express.Router();
const { newOrderCod, getAllOrders, getAllOrdersAdmin, getMyOrder, updateStatus, getStats } = require('../controller/order');
const { isAuth } = require('../middlewares/isAuth');

router.post("/order/new/cod", isAuth,newOrderCod);
router.get("/order/all", isAuth, getAllOrders);
router.get("/order/admin/all", isAuth, getAllOrdersAdmin);
router.get("/order/:id", isAuth, getMyOrder);
router.post("/order/:id", isAuth, updateStatus);
router.get("/stats", isAuth, getStats);

module.exports = router;