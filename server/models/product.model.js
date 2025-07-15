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
    color: {
        type: String,
        default: "Black"
    },
    washCare: {
        type: String,
        default: "Machine wash"
    },
    packageContains: {
        type: String,
        default: ""
    },
    sizeModel: {
        type: String,
        default: "32"
    },
    fabric: {
        type: String,
        default: "80% cotton, 19% polyester, 1% elastane"
    },
    marketedBy: {
        type: String,
        default: "DarkCart Trading (India) Pvt. Ltd."
    },
    importedBy: {
        type: String,
        default: "DarkCart Trading (India) Pvt. Ltd."
    },
    countryOfOrigin: {
        type: String,
        default: "Bangladesh"
    },
    customerCareAddress: {
        type: String,
        default: "Tower-B, 7th Floor, DarkCart Office, Knowledge Park, Main Road, Bengaluru, Karnataka - 560029"
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