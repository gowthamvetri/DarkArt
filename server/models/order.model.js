import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        default : "users",
        ref : 'users',
    },
    orderId : {
        type:String,
        required:true,
        unique:true
    },
    productId:{
        type: mongoose.Schema.ObjectId,
        ref : 'product'
    },
    orderDate:{
        type: Date,
        default: Date.now
    },
    orderQuantity : {
        type: Number,
        default : 1
    },
    productDetails:{
        name : String,
        image : Array
    },
    paymentId : {
        type : String,
        default : ""
    },
    paymentStatus : {
        type: String,
        default : ""
    },
    orderStatus :{
        type: String,
        default : "ORDER PLACED"
    },
    deliveryAddress : {
        type: mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type: Number,
        default: 0
    },
    totalAmt : {
        type: Number,
        default : 0
    },
    invoiceReceipt : {
        type:String,
        default : ""
    }
},{
    timestamps : true
})

const orderModel = mongoose.model('order',orderSchema)

export default orderModel