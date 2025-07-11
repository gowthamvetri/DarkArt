import Router from 'express';
import auth from '../middleware/auth.js';
import { cancelOrderController, cashOnDeliveryOrderController, getAllOrdersController, getOrderController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryOrderController)
orderRouter.get('/order-list',auth,getOrderController);
orderRouter.get('/all',auth,getAllOrdersController);
orderRouter.post('/cancel', auth, cancelOrderController);

export default orderRouter;