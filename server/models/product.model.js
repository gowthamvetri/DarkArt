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
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Kids']
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

// Create text index on name and description for better search results
productSchema.index({ name: 'text', description: 'text' });

// Create separate indexes for regex-based searches
productSchema.index({ name: 1 });
productSchema.index({ description: 1 });

// Create compound indexes for better query performance
productSchema.index({ gender: 1, publish: 1 });
productSchema.index({ category: 1, publish: 1 });
productSchema.index({ price: 1, publish: 1 });
productSchema.index({ createdAt: -1 });

// Compound index for filtered searches
productSchema.index({ publish: 1, gender: 1, category: 1 });

const ProductModel = mongoose.model('product', productSchema);

export default ProductModel;