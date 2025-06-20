import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import UserModel from "../models/users.model.js";
import CartProductModel from "../models/cartProduct.model.js";

export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmount, addressId, subTotalAmt } = req.body;

    console.log("Received data:", {
      userId,
      list_items,
      totalAmount,
      addressId,
      subTotalAmt,
    });

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
      error: error.message,
    });
  }
};

export const getOrderController = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId: userId }).sort({createdAt: -1}).populate("productId", "name image price").populate("deliveryAddress", "address_line city state pincode"). populate("userId", "name email");
        return res.json({
            success: true,
            error: false,
            message: "Orders fetched successfully",
            data: orders
        });
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
            error: error.message
        });
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({createdAt: -1}).populate("productId", "name image price").populate("deliveryAddress", "address_line city state pincode").populate("userId", "name email");
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
            error: error.message
        });
    }
}

