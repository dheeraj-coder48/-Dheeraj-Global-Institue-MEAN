const express = require("express");
const router = express.Router();
const authenicateJWT = require("./../middleware/auth.middleware");
const{createNotice,
    getNotice,
    deleteNotice,
    updateNotice
} = require("../controllers/notice");



router.post("/",authenicateJWT,createNotice);
router.get("/",getNotice);
router.delete("/:id",authenicateJWT, deleteNotice);
router.put("/:id",authenicateJWT, updateNotice);


module.exports = router;