const express = require("express");
const router = express.Router();
const authenicateJWT = require("./../middleware/auth.middleware");
const{createTeacher,
    getTeacher,
    deleteTeacher,
    updateTeacher
} = require("../controllers/teacher");



router.post("/",authenicateJWT,createTeacher);
router.get("/",getTeacher);
router.delete("/:id",authenicateJWT, deleteTeacher);
router.put("/:id",authenicateJWT, updateTeacher);


module.exports = router;