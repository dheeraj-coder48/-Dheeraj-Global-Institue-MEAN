const express = require("express");
const router = express.Router();
const authenticateJWT = require("./../middleware/auth.middleware");
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    markAsResolved,
    getStats
} = require("../controllers/lostFound.controller");

// Public routes
router.post("/", createPost);              // Anyone can post
router.get("/", getPosts);                 // Anyone can view
router.get("/stats", getStats);             // Anyone can view stats
router.get("/:id", getPostById);            // Anyone can view single post
router.patch("/:id/resolve", markAsResolved); // Anyone can mark as resolved

// Admin only routes (protected)
router.put("/:id", authenticateJWT, updatePost);
router.delete("/:id", authenticateJWT, deletePost);

module.exports = router;