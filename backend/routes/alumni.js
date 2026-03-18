const express = require("express");
const router = express.Router();
const authenticateJWT = require("./../middleware/auth.middleware");
const {
    createAlumni,
    getVerifiedAlumni,
    getPendingAlumni,
    getAlumniById,
    updateAlumni,
    verifyAlumni,
    rejectAlumni,
    getAlumniStats,
    getFeaturedAlumni
} = require("../controllers/alumni.controller");

// =====================
// PUBLIC ROUTES (No auth required)
// =====================
router.post("/", createAlumni);                          // Register (status = pending)
router.get("/verified", getVerifiedAlumni);              // Get only verified alumni
router.get("/stats", getAlumniStats);                    // Get stats
router.get("/featured", getFeaturedAlumni);              // Get featured

// =====================
// ADMIN ONLY ROUTES (Auth required) - ORDER IS CRITICAL!
// =====================
router.get("/pending", authenticateJWT, getPendingAlumni);    // Get pending approvals
router.put("/verify/:id", authenticateJWT, verifyAlumni);     // Verify alumni
router.delete("/reject/:id", authenticateJWT, rejectAlumni);  // Reject/delete alumni
router.put("/:id", authenticateJWT, updateAlumni);            // Update alumni

// =====================
// THIS MUST BE LAST - Get single alumni by ID
// =====================
router.get("/:id", getAlumniById);

module.exports = router;