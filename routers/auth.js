const express = require("express");
const {register, getUser,login,logout,imageUpload,forgotPassword,resetPassword,editDetails} = require("../controllers/auth");
const router = express.Router();
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");

// router.get("/",(req,res) =>{
//     res.send("Auth Home Page");
// })

router.post("/register",register);
router.get("/profile",getAccessToRoute,getUser); // ilk önce getAccessToRoute çalışır
router.post("/login",login);
router.get("/logout",getAccessToRoute,logout);
router.post("/upload",[getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload);
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.put("/edit",getAccessToRoute,editDetails);

module.exports = router;