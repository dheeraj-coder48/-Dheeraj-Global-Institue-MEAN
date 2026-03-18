const LostFound = require("../models/LostFound.Model");

// =====================
// CREATE new post
// =====================
exports.createPost = async (req, res) => {
    try {
        const { 
            type, itemName, description, category, location, date,
            contactName, contactPhone, contactEmail, rollNumber, imagesUrl 
        } = req.body;

        // Validation
        if (!type || !itemName || !description || !category || !location || !date || 
            !contactName || !contactPhone || !contactEmail || !imagesUrl) {
            return res.status(400).json({ 
                status: "N", 
                error: "All fields are required." 
            });
        }

        const newPost = new LostFound({
            type, itemName, description, category, location, date,
            contactName, contactPhone, contactEmail, rollNumber, imagesUrl
        });

        await newPost.save();
        
        return res.status(201).json({ 
            status: "Y", 
            message: `${type === 'lost' ? 'Lost' : 'Found'} item posted successfully.`,
            data: newPost
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// GET all posts with filters
// =====================
exports.getPosts = async (req, res) => {
    try {
        const { 
            type, category, search, status, page = 1, limit = 12 
        } = req.query;

        // Build filter object
        let filter = { status: { $ne: 'deleted' } };
        
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (status) filter.status = status;
        
        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const posts = await LostFound.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await LostFound.countDocuments(filter);

        // Process images for frontend
        const processedPosts = posts.map(post => {
            const postObj = post.toObject();
            postObj.images = postObj.imagesUrl ? postObj.imagesUrl.split(',') : [];
            return postObj;
        });

        return res.status(200).json({
            status: "Y",
            message: "Success",
            data: processedPosts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasMore: skip + posts.length < total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// GET single post by ID
// =====================
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await LostFound.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                status: "N", 
                error: "Post not found" 
            });
        }

        const postObj = post.toObject();
        postObj.images = postObj.imagesUrl ? postObj.imagesUrl.split(',') : [];

        return res.status(200).json({
            status: "Y",
            message: "Success",
            data: postObj
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// UPDATE post (Admin only - with auth)
// =====================
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const post = await LostFound.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                status: "N", 
                error: "Post not found" 
            });
        }

        const updatedPost = await LostFound.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        const postObj = updatedPost.toObject();
        postObj.images = postObj.imagesUrl ? postObj.imagesUrl.split(',') : [];

        return res.status(200).json({
            status: "Y",
            message: "Post updated successfully",
            data: postObj
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// DELETE post (Admin only - with auth)
// =====================
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await LostFound.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                status: "N", 
                error: "Post not found" 
            });
        }

        // Soft delete
        await LostFound.findByIdAndUpdate(id, { status: 'deleted' });

        return res.status(200).json({
            status: "Y",
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// MARK AS RESOLVED (Public)
// =====================
exports.markAsResolved = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, rollNumber, message } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ 
                status: "N", 
                error: "Name and phone are required" 
            });
        }

        const post = await LostFound.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                status: "N", 
                error: "Post not found" 
            });
        }

        if (post.status === 'resolved') {
            return res.status(400).json({ 
                status: "N", 
                error: "This item has already been marked as resolved" 
            });
        }

        post.status = 'resolved';
        post.resolvedBy = { name, phone, email, rollNumber };
        post.resolvedDate = new Date();
        post.resolvedMessage = message || '';

        await post.save();

        return res.status(200).json({
            status: "Y",
            message: "Item marked as resolved successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};

// =====================
// GET STATS for dashboard
// =====================
exports.getStats = async (req, res) => {
    try {
        const totalLost = await LostFound.countDocuments({ type: 'lost', status: 'active' });
        const totalFound = await LostFound.countDocuments({ type: 'found', status: 'active' });
        const totalResolved = await LostFound.countDocuments({ status: 'resolved' });
        
        // Category-wise breakdown
        const lostByCategory = await LostFound.aggregate([
            { $match: { type: 'lost', status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const foundByCategory = await LostFound.aggregate([
            { $match: { type: 'found', status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        return res.status(200).json({
            status: "Y",
            data: {
                totalLost,
                totalFound,
                totalResolved,
                lostByCategory,
                foundByCategory
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            status: "N", 
            error: `Internal Server Error: ${error}` 
        });
    }
};