const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    farmerName: {
        type: String,
        required: [true, 'Farmer name is required'],
        trim: true
    },
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Spices', 'Other']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['kg', 'quintal', 'ton', 'liters', 'pieces']
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'Price per unit is required'],
        min: [0, 'Price cannot be negative']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'unavailable'],
        default: 'available'
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, status: 1 });
productSchema.index({ farmerName: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
