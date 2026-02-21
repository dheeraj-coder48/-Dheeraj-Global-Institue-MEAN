const express = require("express");
const router = express.Router();
const authenicateJWT = require("./../middleware/auth.middleware");
const{createEvent,
    getEvent,
    deleteEvent,
    updateEvent
} = require("../controllers/event");



router.post("/",authenicateJWT,createEvent);
router.get("/",getEvent);
router.delete("/:id",authenicateJWT, deleteEvent);
router.put("/:id",authenicateJWT, updateEvent);


module.exports = router;