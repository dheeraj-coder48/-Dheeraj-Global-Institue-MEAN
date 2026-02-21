const express = require("express");
const router = express.Router();
const authenicateJWT = require("./../middleware/auth.middleware");
const{createGallery,
    getGallery,
    deleteGallery,
    updateGallery
} = require("../controllers/gallery");



router.post("/",authenicateJWT,createGallery);
router.get("/",getGallery);
router.delete("/:id",authenicateJWT, deleteGallery);
router.put("/:id",authenicateJWT, updateGallery);


module.exports = router;