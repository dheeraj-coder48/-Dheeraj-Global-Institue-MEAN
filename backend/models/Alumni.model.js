const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    
    // Academic Information
    batch: {
        type: String,
        required: true
    },
    program: {
        type: String,
        enum: ['Science', 'Commerce', 'Arts', 'BBA', 'BCA', 'B.Com', 'MBA', 'MCA', 'Other'],
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    
    // Professional Information
    currentEmployer: {
        type: String
    },
    designation: {
        type: String
    },
    industry: {
        type: String
    },
    location: {
        type: String
    },
    
    // Social Links
    linkedin: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    
    // Profile
    profilePicture: {
        type: String
    },
    bio: {
        type: String
    },
    achievements: {
        type: String
    },
    
    // STATUS FIELDS - CRITICAL FOR VERIFICATION
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    
    // Statistics
    views: {
        type: Number,
        default: 0
    },
    connections: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for search
alumniSchema.index({ name: 'text', batch: 'text', currentEmployer: 'text' });
alumniSchema.index({ batch: 1 });
alumniSchema.index({ program: 1 });
alumniSchema.index({ industry: 1 });
alumniSchema.index({ status: 1 }); // Important for filtering

const Alumni = mongoose.model("Alumni", alumniSchema);
module.exports = Alumni;