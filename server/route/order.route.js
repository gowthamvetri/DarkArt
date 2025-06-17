import Router from 'express';
import auth from '../middleware/auth.js';
import { cashOnDeliveryOrderController, getOrderController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryOrderController)
orderRouter.get('/order-list',auth,getOrderController);

export default orderRouter;