const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema({
    // Type of post
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    
    // Item details
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Electronics', 'Books', 'Clothing', 'Accessories', 'ID Cards', 'Stationery', 'Other'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    
    // Contact info
    contactName: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String
    },
    
    // Images - comma-separated URLs like gallery
    imagesUrl: {
        type: String,
        required: true
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'resolved', 'deleted'],
        default: 'active'
    },
    
    // Resolution details (when someone claims)
    resolvedBy: {
        name: String,
        phone: String,
        email: String,
        rollNumber: String
    },
    resolvedDate: {
        type: Date
    },
    resolvedMessage: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for search
lostFoundSchema.index({ itemName: 'text', description: 'text' });
lostFoundSchema.index({ category: 1 });
lostFoundSchema.index({ type: 1 });
lostFoundSchema.index({ date: -1 });
lostFoundSchema.index({ status: 1 });

const LostFound = mongoose.model("LostFound", lostFoundSchema);
module.exports = LostFound;