import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/users.model.js";


export const addToCartItemController = async (req, res) => {
    try {
        const userId = req?.userId;
        const { productId } = req?.body;

        if(!productId){
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId,
        });

        if(checkItemCart) {
            return res.status(400).json({
                message: "Product already exists in cart",
                error: true,
                success: false,
            });
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId,
        });

        const save = await cartItem.save();

        const updateCartUser = await UserModel.findByIdAndUpdate(
            {_id:userId},
            {
                $push: {
                    shopping_cart : productId
                },
            },
            { new: true }
        );

        return res.json({
            message: "Product added to cart successfully",
            error: false,
            success: true,
            data: save,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}

export const getCartItemController = async (req, res) => {
    try {
        const userId = req?.userId;
        const cartItems = await CartProductModel.find({ userId: userId }).populate("productId");

        return res.json({
            message: "Cart items fetched successfully",
            error: false,
            success: true,
            data: cartItems,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
}