import Router from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import { cancelOrderController, cashOnDeliveryOrderController, getAllOrdersController, getOrderController, updateOrderStatusController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryOrderController)
orderRouter.get('/order-list',auth,getOrderController);
orderRouter.get('/all',auth,admin,getAllOrdersController);
orderRouter.post('/cancel', auth, cancelOrderController);
orderRouter.put('/update-status', auth, admin, updateOrderStatusController);

export default orderRouter;