
const { profile } = require("console");
const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

//Storage, FileFilter
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        
    
        const rootDir = path.dirname(require.main.filename);//main dosyamızın yani server.js'in nerede olduğunu path.dirname bize söyleyecek
        cb(null,path.join(rootDir,"/public/uploads"));
    },
    filename : function(req,file,cb){
        //File - Mimetype - image/png

        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;
        cb(null,req.savedProfileImage);
    }
});
const fileFilter = (req,file,cb) => {
    let allowedMimeTypes = ["image/jpg","image/gif","image/jpeq","image/png"];

    if(!allowedMimeTypes.includes(file.mimetype)){ //array'in içindeki mimetype'lar dışında bir mimetype olursa false olacak
        return cb(new CustomError("Please provide a valid image file",400),false); //2. parametre dosya işleminin devam etmemesi için
    }
    return cb(null,true); //hataya girmezsek image upload devam etsin diye true döndürüyoruz
};

const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;
