import { Router } from 'express';
import Auth from '../middleware/auth.js';
import { validateStockAvailability } from '../middleware/stockValidation.js';
import { 
    cashOnDeliveryOrderController,
    getOrderController,
    getAllOrdersController,
    cancelOrderController,
    updateOrderStatusController
} from '../controllers/order.controller.js';

const orderRouter = Router();

// Apply stock validation middleware before order creation
orderRouter.post('/cash-on-delivery', Auth, validateStockAvailability, cashOnDeliveryOrderController);
orderRouter.get('/get', Auth, getOrderController);
orderRouter.get('/all-orders', Auth, getAllOrdersController);
orderRouter.post('/cancel-order', Auth, cancelOrderController);
orderRouter.put('/update-order-status', Auth, updateOrderStatusController);

export default orderRouter;