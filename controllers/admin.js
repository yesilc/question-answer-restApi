const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const blockUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id} =req.params;
    const user = await User.findById(id);
    //router->admin.js'de router.use(checkUserExist); ile kullanıcının olup olmadığını önceden kontrol ettiğimiz için burada if sorgusuyla kullanıcıyı kontrol etmemize gerek yok.

    user.blocked = !user.blocked; //true ise  false; false ise true

    await user.save();

    return res.status(200)
    .json({
        success : true,
        message : "Block - Unblock successful"
    })
});
const deleteUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id} = req.params;
    const user = await User.findById(id);
    await user.remove();

    return res.status(200)
    .json({
        success : true,
        message : "Delete Operation Successful"
    })
});

module.exports = {
    blockUser,
    deleteUser
}