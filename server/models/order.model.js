import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        ref : 'users',
        required: true
    },
    orderId : {
        type: String,
        required: true,
        unique: true
    },
    // Updated to support multiple items in single order
    items: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'product', // Make sure this matches your product model name
            required: true
        },
        productDetails: {
            name: String,
            image: Array,
            price: Number
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        itemTotal: {
            type: Number,
            required: true
        }
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        default: ""
    },
    paymentStatus: {
        type: String,
        default: ""
    },
    orderStatus: {
        type: String,
        default: "ORDER PLACED"
    },
    deliveryAddress: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const orderModel = mongoose.model('order', orderSchema);

export default orderModel;