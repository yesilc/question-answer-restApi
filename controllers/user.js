const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const getSingleUser = asyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params;
    const user = await User.findById(id);

    // if(!user){
    //     return next(new CustomError("There is no such user with that id",400));
    // } databaseErrorHelpers middleware'i ile önceden kontrol ediyoruz

    return res.status(200)
    .json({
        success : true,
        data : user
    })
});
const getAllUsers = asyncErrorWrapper(async (req,res,next) =>{
    // const users = await User.find(); //find'ın içine bir şey girilmezse bütün kayıtları alır

    return res.status(200)
    .json(res.queryResults);
});
module.exports = {
    getSingleUser,
    getAllUsers
}