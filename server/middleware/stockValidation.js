import ProductModel from "../models/product.model.js";

export const validateStockAvailability = async (req, res, next) => {
    try {
        const { list_items } = req.body;
        
        if (!list_items || !Array.isArray(list_items)) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Invalid order items"
            });
        }

        // Check stock for each item
        for (const item of list_items) {
            const product = await ProductModel.findById(item.productId._id);
            
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: true,
                    message: `Product not found: ${item.productId.name || 'Unknown Product'}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    error: true,
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
                    productId: product._id,
                    availableStock: product.stock,
                    requestedQuantity: item.quantity
                });
            }

            // Check if product is published
            if (!product.publish) {
                return res.status(400).json({
                    success: false,
                    error: true,
                    message: `Product "${product.name}" is not available for purchase`
                });
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error validating stock availability",
            details: error.message
        });
    }
};