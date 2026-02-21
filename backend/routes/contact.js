const express = require("express");
const router = express.Router();
const{createContact,getContacts,deleteContacts} = require("../controllers/contact");
const authenicateJWT = require("./../middleware/auth.middleware");


router.post("/",createContact);
router.get("/",authenicateJWT,getContacts);
router.delete("/:id",authenicateJWT, deleteContacts);



module.exports = router;