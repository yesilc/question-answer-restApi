//https://mongoosejs.com/docs/guide.html

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const Question = require("./Question");

const UserSchema = new Schema({  //Schema : şema
    name: { //name alanı mutlaka girilmesi gereken bir alan olacak. Name alanı mutlaka gereken bir alan aksi halde bu modelimizi mongodb veri tabanımıza ekleyemeyeceğiz
        type : String,
        // require : true
        required : [true,"Please provide a name"] //true olmazsa mesaj geriye döndürebiliriz.
    },
    email : {
        type : String,
        required : [true,"Please provide an email"],  //required : true email girilmesini zorunlu kılıyor
        unique : true,
        match : [ //email reg ex validation
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email" //geçersiz email adresi girildiğinde mesaj yazacak
        ] 
    },
    role : {
        type : String,
        default : "user", //role admin olarak beilirtilmediği sürece default olarak user
        enum : ["user","admin"] //rolleri enum ile belirtebiliriz
    },
    password : {
        type : String,
        minlength : [6,"Please provide a password with min length : 6"],
        required : [true,"Please provide a valid password"],
        select : false //password gözükmeyecek
    },
    createAt : { //required : true olmayan alanlar zorunlu değil
        type :Date,
        default : Date.now
    },
    title : {
        type : String
    },    
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    blocked : { //admin tarafından block'lanıp block'lanmadığı
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
});
//User.js 'den herhangi bir user oluşturduğumuz zaman veritabanında direkt olarak users şeklinde bir collection'ımız olacak

//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;
    const payload = {
        id : this._id,
        name : this.name
    };

    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    });
    return token;
}

//https://mongoosejs.com/docs/middleware.html#pre
UserSchema.pre("save",function(next){ //veriler veritabanına kaydedilmeden önce çalıştı
    // console.log(this); //kaydedilmeye hazır user'ı gösteriyor
    
    //İleride bu userımızın belli bilgilerini değiştirdiğimiz zaman tekrardan bu userımızı save edeceğiz ve burası tekrar çalışacak ancak password değişmemişse buranın tekrar çalışmasını istemiyoruz
    if(!this.isModified("password")){ //isModified ->içine girdiğimiz belli bir alan değişmişse true değişmemişse false döndürecek |
        next(); //değişmemişse aşağıdaki işlemleri girmeden devam edeceğiz.
    }
    
    
    
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err); //burada herhangi bir hata oluşursa biz bunu next parametresiyle daha önceden yazmış olduğumuz customhandler'a gönderebiliriz
        
        bcrypt.hash(this.password, salt, (err, hash)=> {
           if(err) next(err);
           this.password = hash;
           next();
        });
    });
});
UserSchema.methods.getResetPasswordTokenFromUser = function(){
    const randomHexString = crypto.randomBytes(15).toString("hex"); //15-> 15 tane random bytler üretecek ve bu bytlerı da hex değerlerine çevirmek için toString("hex") kullanıyoruz.

    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)

    return resetPasswordToken;

}
UserSchema.post("remove",async function(){
    await Question.deleteMany({ //https://mongoosejs.com/docs/middleware.html
        user : this._id
    });
});

module.exports = mongoose.model("User",UserSchema); //userschemayı hem mongoose'a kaydediyoruz hem de kullanmak için dışarıya aktarıyoruz