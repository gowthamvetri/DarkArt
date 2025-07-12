import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        default: []
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: true
    }],
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    publish: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;