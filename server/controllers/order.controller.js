import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import UserModel from "../models/users.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import sendEmail from "../config/sendEmail.js";

export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmount, addressId, subTotalAmt, quantity } = req.body;

    console.log("Received data:", {
      userId,
      list_items,
      totalAmount,
      addressId,
      subTotalAmt,
      quantity
    });

    // Get user details for email
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found"
      });
    }

    const payload = list_items.map((item) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: item.productId._id,
        productDetails: {
          name: item.productId.name,
          image: item.productId.image,
        },
        paymentId: "",
        orderQuantity: quantity,
        orderDate: new Date(),
        paymentStatus: "CASH ON DELIVERY",
        deliveryAddress: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmount,
      };
    });

    console.log(payload);

    const generatedOrder = await orderModel.insertMany(payload);

    const removeCartItems = await CartProductModel.deleteMany({ userId: userId });
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    // Send confirmation email with proper recipient
    try {
      await sendEmail({
        sendTo: user.email,  // ✅ Use user.email instead of req.userEmail
        subject: "Order Confirmation - Casual Clothing Fashion",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! Your order has been placed successfully.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${generatedOrder[0].orderId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
            </div>
            
            <p>Your order will be delivered to your specified address within 3-5 business days.</p>
            <p>You can track your order status from your account dashboard.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
              <p>Thank you for shopping with Casual Clothing Fashion!</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the order if email fails
    }

    return res.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error in cash payment controller",
      details: error.message,
    });
  }
};

export const getOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId: userId })
          .sort({createdAt: -1})
          .populate("productId", "name image price")
          .populate("deliveryAddress", "address_line city state pincode country")
          .populate("userId", "name email");
          
        return res.json({
            success: true,
            error: false,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error in fetching orders",
            details: error.message
        });
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
          .sort({createdAt: -1})
          .populate("userId", "name email")
          .populate("productId", "name image price")
          .populate("deliveryAddress", "address_line city state pincode country");
          
        return res.json({
            success: true,
            error: false,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error in fetching orders",
            details: error.message
        });
    }
}

export const cancelOrderController = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.userId;

        // Find the order
        const order = await orderModel.findOne({ orderId: orderId, userId: userId });
        console.log(order);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Order not found"
            });
        }

        // Check if order can be cancelled (you can add your business logic here)
        if (order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED") {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Order cannot be cancelled"
            });
        }

        // Update order status to cancelled
        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId: orderId, userId: userId },
            { 
              orderStatus: "CANCELLED",
              paymentStatus: "CANCELLED"
            },
            { new: true }
        );

        // Get user details for email notification
        const user = await UserModel.findById(userId);
        
        // Send cancellation email
        if (user && user.email) {
            try {
                await sendEmail({
                    sendTo: user.email,
                    subject: "Order Cancellation Confirmation - Casual Clothing Fashion",
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #d32f2f; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Cancelled</h2>
                        <p>Dear ${user.name},</p>
                        <p>Your order has been cancelled successfully as requested.</p>
                        
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                          <h3 style="margin-top: 0; color: #856404;">Cancelled Order Details:</h3>
                          <p><strong>Order ID:</strong> ${orderId}</p>
                          <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
                          <p><strong>Refund Status:</strong> If payment was made, refund will be processed within 5-7 business days</p>
                        </div>
                        
                        <p>If you have any questions about this cancellation, please contact our customer support.</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
                          <p>Thank you for choosing Casual Clothing Fashion!</p>
                          <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                      </div>
                    `
                });
            } catch (emailError) {
                console.error("Cancellation email sending failed:", emailError);
            }
        }

        return res.json({
            success: true,
            error: false,
            message: "Order cancelled successfully",
            data: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error in cancelling order",
            details: error.message
        });
    }
}
