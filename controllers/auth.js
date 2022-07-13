const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { request } = require("express");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

// const register =async (req,res,next) => {
const register = asyncErrorWrapper(async (req,res,next) => { //async yapıyoruz ki await kullanabilelim
    //POST DATA
    const {name,email,password,role} = req.body;


    const user =  await User.create({
        // name : name, //yukarıdaki name
        // email : email karşılıklı olarak aynı oldukları için es6 standartlarında  bu şekilde yazmak zorunda değiliz   
        name,
        email,
        password,
        role
    }); //User.create dediğimiz zaman bu user'ımız oluşturmuş olduğumuz mongodb veritabanına kaydolacak ve burada kaydedilen verilerimiz await yapsıyla bekleyecek ve eğer herhangi bir sıkıntı çıkmazsa(validasyon) user şeklinde bunu alabiliriz
    sendJwtToClient(user,res);
});
 
//http://expressjs.com/en/guide/error-handling.html#error-handling
const errorTest = (req,res,next) => {
    //  throw new Error("Bir Hata oluştu");
    return next(new TypeError("Custom Error Message",400));
    //Question Does Not Exist
    // return next(new CustomError("Question Does Not Exist"))
}
const login = asyncErrorWrapper(async(req,res,next) => {
    const {email,password} = req.body;
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400));
    }
    const user = await User.findOne({email}).select("+password"); //email gönderirsek bu emaile göre user'ı arayacak ve user'ı bize dönecek -- select("+password") -> user modelinde password için select : false demiştik ama passwordleri karşılaştırabilmek için password'u almamız gerekiyor.
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400)); //next ile customErrorHandler'a gidiyor
    }
    
    sendJwtToClient(user,res);
});
const logout = asyncErrorWrapper(async(req,res,next) => {
    const {NODE_ENV} = process.env;
    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()), //bunu yaptığımız zaman cookie yok olacak
        secure: NODE_ENV === "development" ? false : true
    })
    .json({
        success: true,
        message: "Logout successfulS"
    })
});

const getUser = (req,res,next) =>{
    res.json({
        success: true,
        data  : {
            id : req.user.id,
            name : req.user.name
        }
    })
};

const imageUpload =  asyncErrorWrapper(async(req,res,next) => {
    // Image Upload Success
    const user =  await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,  //user'a kullanıcının güncellenmiş bilgilerinin gelmesini istiyorsak 3. parametre olarak bunu giriyoruz.
        runValidators : true
    });
    res.status(200)
    .json({
        success : true,
        message : "Image Upload Successful",
        data: user
    });
});

//Forgot Password
const forgotPassword = asyncErrorWrapper(async(req,res,next) => {
    const resetEmail = req.body.email;
    const user = await User.findOne({email : resetEmail});

    if(!user){ //bu email ile kullanıcı bulunmadıysa
        return next(new CustomError("There is no user with that email",400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save(); //User modelini yeni değerlerle kaydetmek için
    
    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    
    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p> 
        `;//target = _blank yeni sekmede açsın diye

    try{ //burada herhangi bir sıkıntı olursa resetpasswordtoken'ı ve resetpasswordexpire'ı tekrardan undefined yapmamız gerekiyor
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Password",
            html : emailTemplate
        });
        return res.status(200).json({
            success : true,
            message : "Token Sent To Your Email"
        })
    }
    catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent",500));
    }
        
       
});
const resetPassword = asyncErrorWrapper(async(req,res,next) => {
    
    const {resetPasswordToken} = req.query;

    const {password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token",400));
    };
    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()} //bunu 1 saat olarak ayarlamıştık diyelim 1 saat geçti. bizim reset passwordexpire'ımız şu anki zamanımızdan küçük bir değer olmak zorunda. Yani eğer bizim expire'ımız 1 saat geçmişse bizim resetpasswordexpire date.now'dan küçük bir değer olmuş demektir. Bizim resetpasswordexpire'ı şu anki date.now'dan(şu anki tarihten) ileri bir tarih olmasını sorglamamız gerekiyor
    });
    if(!user){
        return next(new CustomError("Invalid Token or Session Expires",404));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return res.status(200)
    .json({
        success : true,
        message : "Reset Password Process Successful"
    })
});
const editDetails = asyncErrorWrapper(async(req,res,next) => {
    const editInformation = req.body;
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators : true
    });
    return res.status(200)
    .json({
        success : true,
        data : user
    })
});
module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};








// const register =async (req,res,next) => {
//     const name = "Ömercan Yeşil";
//     const email = "omercanyesil@gmail.com";
//     const password = "12345";
//     try{

//         const user =  await User.create({
//             name,
//             email,
//             password
//         });
//         res
//         .status(200)
//         .json({
//             succes: true,
//             data : user
//         })
//     }
//     catch (err){
//         return next(err);
//     }
// }
