const Alumni = require("../models/Alumni.model");

// =====================
// CREATE new alumni (PUBLIC - status = pending)
// =====================
exports.createAlumni = async (req, res) => {
    try {
        const { 
            name, email, phone, batch, program, rollNumber,
            currentEmployer, designation, industry, location,
            linkedin, facebook, instagram, profilePicture, bio, achievements
        } = req.body;

        // Validation
        if (!name || !email || !phone || !batch || !program || !rollNumber) {
            return res.status(400).json({ 
                status: "N", 
                error: "Required fields are missing." 
            });
        }

        // Check if email already exists
        const existingAlumni = await Alumni.findOne({ email });
        if (existingAlumni) {
            return res.status(400).json({ 
                status: "N", 
                error: "Alumni with this email already exists." 
            });
        }

        const newAlumni = new Alumni({
            name, email, phone, batch, program, rollNumber,
            currentEmployer, designation, industry, location,
            linkedin, facebook, instagram, profilePicture, bio, achievements,
            status: 'pending', // IMPORTANT: Default to pending
            isActive: true,
            isVerified: false
        });

        await newAlumni.save();
        
        return res.status(201).json({ 
            status: "Y", 
            message: "Registration submitted successfully! Your profile will be visible after admin verification.",
            data: newAlumni
        });

    } catch (error) {
        console.error('Error in createAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// GET verified alumni only (PUBLIC)
// =====================
exports.getVerifiedAlumni = async (req, res) => {
    try {
        const { 
            batch, program, industry, search, 
            page = 1, limit = 12 
        } = req.query;

        // Build filter object - ONLY VERIFIED
        let filter = { status: 'verified' };
        
        if (batch) filter.batch = batch;
        if (program) filter.program = program;
        if (industry) filter.industry = industry;
        
        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const alumni = await Alumni.find(filter)
            .sort({ batch: -1, name: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Alumni.countDocuments(filter);

        return res.status(200).json({
            status: "Y",
            message: "Success",
            data: alumni,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasMore: skip + alumni.length < total
            }
        });

    } catch (error) {
        console.error('Error in getVerifiedAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// GET pending alumni (ADMIN ONLY) - FIXED VERSION
// =====================
exports.getPendingAlumni = async (req, res) => {
    try {
        console.log('📢 Fetching pending alumni...');
        
        // First, let's check total count
        const totalCount = await Alumni.countDocuments();
        console.log(`📊 Total alumni in database: ${totalCount}`);

        // Count by status
        const pendingCount = await Alumni.countDocuments({ status: 'pending' });
        const verifiedCount = await Alumni.countDocuments({ status: 'verified' });
        const noStatusCount = await Alumni.countDocuments({ status: { $exists: false } });
        
        console.log(`📊 Status breakdown - Pending: ${pendingCount}, Verified: ${verifiedCount}, No Status: ${noStatusCount}`);

        // FIX: If there are documents without status field, update them
        if (noStatusCount > 0) {
            console.log(`🔄 Updating ${noStatusCount} documents without status field...`);
            await Alumni.updateMany(
                { status: { $exists: false } },
                { $set: { status: 'pending' } }
            );
            console.log('✅ Update complete');
        }

        // Get pending alumni
        const alumni = await Alumni.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`✅ Found ${alumni.length} pending alumni`);

        return res.status(200).json({
            status: "Y",
            data: alumni
        });

    } catch (error) {
        console.error('❌ Error in getPendingAlumni:', error);
        console.error('❌ Error stack:', error.stack);
        
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// VERIFY alumni (ADMIN ONLY) - FIXED VERSION
// =====================
exports.verifyAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.id; // From auth middleware

        console.log(`🔍 Verifying alumni with ID: ${id}`);

        const alumni = await Alumni.findById(id);
        
        if (!alumni) {
            console.log(`❌ Alumni not found with ID: ${id}`);
            return res.status(404).json({ 
                status: "N", 
                error: "Alumni not found" 
            });
        }

        // Update alumni status
        alumni.status = 'verified';
        alumni.isVerified = true;
        alumni.verifiedBy = adminId;
        alumni.verifiedAt = new Date();
        
        await alumni.save();

        console.log(`✅ Alumni verified successfully: ${alumni.name}`);

        return res.status(200).json({
            status: "Y",
            message: "Alumni verified successfully",
            data: alumni
        });

    } catch (error) {
        console.error('❌ Error in verifyAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// REJECT/DELETE alumni (ADMIN ONLY) - FIXED VERSION
// =====================
exports.rejectAlumni = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🔍 Rejecting alumni with ID: ${id}`);

        // Option 1: Soft delete (update status to rejected)
        const alumni = await Alumni.findByIdAndUpdate(
            id, 
            { 
                status: 'rejected', 
                isActive: false 
            },
            { new: true }
        );
        
        // Option 2: Hard delete (permanent removal) - Uncomment if you want permanent delete
        // const alumni = await Alumni.findByIdAndDelete(id);
        
        if (!alumni) {
            console.log(`❌ Alumni not found with ID: ${id}`);
            return res.status(404).json({ 
                status: "N", 
                error: "Alumni not found" 
            });
        }

        console.log(`✅ Alumni rejected successfully: ${alumni.name}`);

        return res.status(200).json({
            status: "Y",
            message: "Alumni rejected successfully"
        });

    } catch (error) {
        console.error('❌ Error in rejectAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// UPDATE alumni (ADMIN ONLY)
// =====================
exports.updateAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(`🔍 Updating alumni with ID: ${id}`);

        const alumni = await Alumni.findById(id);
        
        if (!alumni) {
            return res.status(404).json({ 
                status: "N", 
                error: "Alumni not found" 
            });
        }

        // Don't allow status update through this endpoint
        if (updateData.status) {
            delete updateData.status;
        }

        const updatedAlumni = await Alumni.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        console.log(`✅ Alumni updated successfully: ${updatedAlumni.name}`);

        return res.status(200).json({
            status: "Y",
            message: "Alumni profile updated successfully",
            data: updatedAlumni
        });

    } catch (error) {
        console.error('❌ Error in updateAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// GET single alumni by ID (PUBLIC - only if verified)
// =====================
exports.getAlumniById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if ID is valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                status: "N", 
                error: "Invalid alumni ID format" 
            });
        }
        
        const alumni = await Alumni.findOne({ 
            _id: id, 
            status: 'verified' 
        });
        
        if (!alumni) {
            return res.status(404).json({ 
                status: "N", 
                error: "Alumni not found" 
            });
        }

        // Increment views
        alumni.views += 1;
        await alumni.save();

        return res.status(200).json({
            status: "Y",
            message: "Success",
            data: alumni
        });

    } catch (error) {
        console.error('Error in getAlumniById:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// GET alumni stats (PUBLIC)
// =====================
exports.getAlumniStats = async (req, res) => {
    try {
        const totalAlumni = await Alumni.countDocuments({ status: 'verified' });
        
        // Batch-wise distribution
        const batchDistribution = await Alumni.aggregate([
            { $match: { status: 'verified' } },
            { $group: { _id: '$batch', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);
        
        // Program-wise distribution
        const programDistribution = await Alumni.aggregate([
            { $match: { status: 'verified' } },
            { $group: { _id: '$program', count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            status: "Y",
            data: {
                totalAlumni,
                batchDistribution,
                programDistribution
            }
        });

    } catch (error) {
        console.error('Error in getAlumniStats:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};

// =====================
// GET featured alumni (PUBLIC - only verified)
// =====================
exports.getFeaturedAlumni = async (req, res) => {
    try {
        const featured = await Alumni.find({ 
            status: 'verified',
            profilePicture: { $exists: true, $ne: null }
        })
        .sort({ views: -1, connections: -1 })
        .limit(6);

        return res.status(200).json({
            status: "Y",
            data: featured
        });

    } catch (error) {
        console.error('Error in getFeaturedAlumni:', error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error.message}` 
        });
    }
};