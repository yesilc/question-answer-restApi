const express = require("express");
const {getAccessToRoute,getAdminAccess} = require("../middlewares/authorization/auth");
const {blockUser,deleteUser} =require("../controllers/admin");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");

//Block User
//Delete User
const router = express.Router();
router.use([getAccessToRoute,getAdminAccess]); //iki middleware'in ard arda çalışmasını ve bütün routlarda geçerli olmasını istiyoruz bunun için router.get'in içine yazmak yerine bu şekilde yazabiliriz
// router.use(checkUserExist); //tüm routerlarda geçerli olacak //id geçirilemediği için uygulama düzgün çalışmadı
router.get("/block/:id",checkUserExist,blockUser);
router.delete("/user/:id",checkUserExist,deleteUser);

module.exports = router;