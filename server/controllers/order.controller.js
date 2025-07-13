import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import UserModel from "../models/users.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import ProductModel from "../models/product.model.js"; // Add this import
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

    // Validate stock availability before processing order
    for (const item of list_items) {
      const product = await ProductModel.findById(item.productId._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: true,
          message: `Product ${item.productId.name} not found`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: true,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Create single order payload with all items
    const orderId = `ORD-${new mongoose.Types.ObjectId()}`;
    
    const payload = {
      userId: userId,
      orderId: orderId,
      items: list_items.map(item => ({
        productId: item.productId._id,
        productDetails: {
          name: item.productId.name,
          image: item.productId.image,
          price: item.productId.price
        },
        quantity: item.quantity,
        itemTotal: item.productId.price * item.quantity
      })),
      paymentId: "",
      totalQuantity: quantity, // Total quantity of all items
      orderDate: new Date(),
      paymentStatus: "CASH ON DELIVERY",
      deliveryAddress: addressId,
      subTotalAmt: subTotalAmt,
      totalAmt: totalAmount,
      orderStatus: "ORDER PLACED"
    };

    console.log("Single Order Payload:", payload);

    // Use transaction to ensure data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create single order
      const generatedOrder = await orderModel.create([payload], { session });

      // Update stock for each product
      for (const item of list_items) {
        await ProductModel.findByIdAndUpdate(
          item.productId._id,
          { 
            $inc: { stock: -item.quantity } // Decrease stock by ordered quantity
          },
          { session, new: true }
        );
      }

      // Clear user's cart
      await CartProductModel.deleteMany({ userId: userId }, { session });
      await UserModel.updateOne(
        { _id: userId },
        { shopping_cart: [] },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();

      // Send confirmation email with proper recipient
      try {
        await sendEmail({
          sendTo: user.email,
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
                <p><strong>Total Items:</strong> ${quantity}</p>
                
                <h4>Items Ordered:</h4>
                ${payload.items.map(item => `
                  <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <p><strong>Product:</strong> ${item.productDetails.name}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Price:</strong> ₹${item.productDetails.price}</p>
                    <p><strong>Item Total:</strong> ₹${item.itemTotal}</p>
                  </div>
                `).join('')}
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
        data: generatedOrder[0], // Return single order instead of array
      });

    } catch (transactionError) {
      // Abort transaction on error
      await session.abortTransaction();
      throw transactionError;
    } finally {
      session.endSession();
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error in cash payment controller",
      details: error.message,
    });
  }
};

// Add function to restore stock when order is cancelled
export const cancelOrderController = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.userId;

        // Find the order
        const order = await orderModel.findOne({ orderId: orderId, userId: userId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Order not found"
            });
        }

        // Check if order can be cancelled
        if (order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED") {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Order cannot be cancelled"
            });
        }

        // Use transaction for data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update order status to cancelled
            const updatedOrder = await orderModel.findOneAndUpdate(
                { orderId: orderId, userId: userId },
                { 
                  orderStatus: "CANCELLED",
                  paymentStatus: "CANCELLED"
                },
                { new: true, session }
            );

            // Restore stock for all items in the cancelled order
            for (const item of order.items) {
                await ProductModel.findByIdAndUpdate(
                    item.productId,
                    { 
                        $inc: { stock: item.quantity } // Add back the cancelled quantity
                    },
                    { session, new: true }
                );
            }

            await session.commitTransaction();

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
                              <p><strong>Total Items:</strong> ${order.totalQuantity}</p>
                              
                              <h4>Cancelled Items:</h4>
                              ${order.items.map(item => `
                                <div style="border-bottom: 1px solid #eee; padding: 5px 0;">
                                  <p><strong>Product:</strong> ${item.productDetails.name}</p>
                                  <p><strong>Quantity:</strong> ${item.quantity} (Stock Restored)</p>
                                </div>
                              `).join('')}
                            </div>
                            
                            <p>All items have been restored to inventory. If you have any questions, please contact our customer support.</p>
                            
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
                message: "Order cancelled successfully and stock restored",
                data: updatedOrder
            });

        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error in cancelling order",
            details: error.message
        });
    }
}

// Update order status controller to handle stock when order is delivered/cancelled
// export const updateOrderStatusController = async (req, res) => {
//     try {
//         const { orderId, orderStatus } = req.body;
        
//         // Validate input
//         if (!orderId || !orderStatus) {
//             return res.status(400).json({
//                 success: false,
//                 error: true,
//                 message: "Order ID and status are required"
//             });
//         }
        
//         // Valid status values
//         const validStatuses = ["ORDER PLACED", "PROCESSING", "OUT FOR DELIVERY", "DELIVERED", "CANCELLED"];
//         if (!validStatuses.includes(orderStatus)) {
//             return res.status(400).json({
//                 success: false,
//                 error: true,
//                 message: "Invalid order status value"
//             });
//         }

//         // Find the order
//         const order = await orderModel.findOne({ orderId: orderId });
        
//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 error: true,
//                 message: "Order not found"
//             });
//         }

//         const previousStatus = order.orderStatus;

//         // Use transaction for data consistency
//         const session = await mongoose.startSession();
//         session.startTransaction();

//         try {
//             // Prepare update object
//             const updateData = { orderStatus: orderStatus };
            
//             // If the order is delivered and payment method is cash on delivery, set payment status to PAID
//             if (orderStatus === "DELIVERED" && order.paymentStatus === "CASH ON DELIVERY") {
//                 updateData.paymentStatus = "PAID";
//             }

//             // Handle stock restoration for cancelled orders (updated for multiple items)
//             if (orderStatus === "CANCELLED" && previousStatus !== "CANCELLED") {
//                 // Restore stock for all items when order is cancelled
//                 for (const item of order.items) {
//                     await ProductModel.findByIdAndUpdate(
//                         item.productId,
//                         { 
//                             $inc: { stock: item.quantity }
//                         },
//                         { session, new: true }
//                     );
//                 }
//             }

//             // Update order status
//             const updatedOrder = await orderModel.findOneAndUpdate(
//                 { orderId: orderId },
//                 updateData,
//                 { new: true, session }
//             ).populate("userId", "name email")
//              .populate("items.productId", "name image price stock") // Updated populate path
//              .populate("deliveryAddress", "address_line city state pincode country");

//             await session.commitTransaction();

//             // Get user details for email notification
//             const user = await UserModel.findById(order.userId);
            
//             // Send status update email
//             if (user && user.email) {
//                 try {
//                     const statusMap = {
//                         "ORDER PLACED": "placed",
//                         "PROCESSING": "being processed",
//                         "OUT FOR DELIVERY": "out for delivery",
//                         "DELIVERED": "delivered",
//                         "CANCELLED": "cancelled"
//                     };
                    
//                     const statusText = statusMap[orderStatus] || orderStatus.toLowerCase();
                    
//                     await sendEmail({
//                         sendTo: user.email,
//                         subject: `Order Status Update - ${orderStatus} - Casual Clothing Fashion`,
//                         html: `
//                           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
//                             <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Status Update</h2>
//                             <p>Dear ${user.name},</p>
//                             <p>Your order with ID: <strong>${orderId}</strong> has been updated.</p>
                            
//                             <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;">
//                               <h3 style="margin-top: 0; color: #333;">New Status: ${orderStatus}</h3>
//                               <p>Your order is now being ${statusText}.</p>
//                               ${orderStatus === "CANCELLED" ? `
//                                 <p style="color: #d32f2f;"><strong>Stock Restored:</strong></p>
//                                 ${order.items.map(item => `
//                                   <p style="color: #d32f2f; margin-left: 20px;">• ${item.productDetails.name}: ${item.quantity} units restored</p>
//                                 `).join('')}
//                               ` : ''}
//                             </div>
                            
//                             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
//                               <p>Thank you for shopping with Casual Clothing Fashion!</p>
//                               <p>This is an automated email. Please do not reply to this message.</p>
//                             </div>
//                           </div>
//                         `
//                     });
//                 } catch (emailError) {
//                     console.error("Status update email sending failed:", emailError);
//                 }
//             }

//             return res.json({
//                 success: true,
//                 error: false,
//                 message: "Order status updated successfully",
//                 data: updatedOrder
//             });

//         } catch (transactionError) {
//             await session.abortTransaction();
//             throw transactionError;
//         } finally {
//             session.endSession();
//         }

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error: true,
//             message: "Error updating order status",
//             details: error.message
//         });
//     }
// }
export const getOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId: userId })
          .sort({createdAt: -1})
          .populate("items.productId", "name image price stock") // Updated populate path
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
          .populate("items.productId", "name image price stock") // Updated populate path
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

// Also update the updateOrderStatusController to work with the new structure
export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;
        
        // Validate input
        if (!orderId || !orderStatus) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Order ID and status are required"
            });
        }
        
        // Valid status values
        const validStatuses = ["ORDER PLACED", "PROCESSING", "OUT FOR DELIVERY", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Invalid order status value"
            });
        }

        // Find the order
        const order = await orderModel.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Order not found"
            });
        }

        const previousStatus = order.orderStatus;

        // Use transaction for data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Prepare update object
            const updateData = { orderStatus: orderStatus };
            
            // If the order is delivered and payment method is cash on delivery, set payment status to PAID
            if (orderStatus === "DELIVERED" && order.paymentStatus === "CASH ON DELIVERY") {
                updateData.paymentStatus = "PAID";
            }

            // Handle stock restoration for cancelled orders (updated for multiple items)
            if (orderStatus === "CANCELLED" && previousStatus !== "CANCELLED") {
                // Restore stock for all items when order is cancelled
                for (const item of order.items) {
                    await ProductModel.findByIdAndUpdate(
                        item.productId,
                        { 
                            $inc: { stock: item.quantity }
                        },
                        { session, new: true }
                    );
                }
            }

            // Update order status
            const updatedOrder = await orderModel.findOneAndUpdate(
                { orderId: orderId },
                updateData,
                { new: true, session }
            ).populate("userId", "name email")
             .populate("items.productId", "name image price stock") // Updated populate path
             .populate("deliveryAddress", "address_line city state pincode country");

            await session.commitTransaction();

            // Get user details for email notification
            const user = await UserModel.findById(order.userId);
            
            // Send status update email
            if (user && user.email) {
                try {
                    const statusMap = {
                        "ORDER PLACED": "placed",
                        "PROCESSING": "being processed",
                        "OUT FOR DELIVERY": "out for delivery",
                        "DELIVERED": "delivered",
                        "CANCELLED": "cancelled"
                    };
                    
                    const statusText = statusMap[orderStatus] || orderStatus.toLowerCase();
                    
                    await sendEmail({
                        sendTo: user.email,
                        subject: `Order Status Update - ${orderStatus} - Casual Clothing Fashion`,
                        html: `
                          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Status Update</h2>
                            <p>Dear ${user.name},</p>
                            <p>Your order with ID: <strong>${orderId}</strong> has been updated.</p>
                            
                            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;">
                              <h3 style="margin-top: 0; color: #333;">New Status: ${orderStatus}</h3>
                              <p>Your order is now being ${statusText}.</p>
                              ${orderStatus === "CANCELLED" ? `
                                <p style="color: #d32f2f;"><strong>Stock Restored:</strong></p>
                                ${order.items.map(item => `
                                  <p style="color: #d32f2f; margin-left: 20px;">• ${item.productDetails.name}: ${item.quantity} units restored</p>
                                `).join('')}
                              ` : ''}
                            </div>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
                              <p>Thank you for shopping with Casual Clothing Fashion!</p>
                              <p>This is an automated email. Please do not reply to this message.</p>
                            </div>
                          </div>
                        `
                    });
                } catch (emailError) {
                    console.error("Status update email sending failed:", emailError);
                }
            }

            return res.json({
                success: true,
                error: false,
                message: "Order status updated successfully",
                data: updatedOrder
            });

        } catch (transactionError) {
            await session.abortTransaction();
            throw transactionError;
        } finally {
            session.endSession();
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: "Error updating order status",
            details: error.message
        });
    }
}
