const express = require("express");
const {getSingleUser,getAllUsers} = require("../controllers/user.js")
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");
const router = express.Router();
const {userQueryMiddleware} = require("../middlewares/query/userQueryMiddleware");
const User = require("../models/User");

router.get("/:id",checkUserExist,getSingleUser);
router.get("/",userQueryMiddleware(User),getAllUsers);

module.exports = router;