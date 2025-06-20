import Router from 'express';
import auth from '../middleware/auth.js';
import { cashOnDeliveryOrderController, getAllOrdersController, getOrderController } from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery",auth,cashOnDeliveryOrderController)
orderRouter.get('/order-list',auth,getOrderController);
orderRouter.get('/all',auth,getAllOrdersController);

export default orderRouter;