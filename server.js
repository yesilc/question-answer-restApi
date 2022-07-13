//projenin entrypoint'i(burada biz projemize dahil edeceğimiz packagelarımızı routlarımızı ve controllerlarımızı dahil edeceğiz)
const express = require("express"); //express'i dahil ediyoruz
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
// const question = require("./routers/question");
// const auth = require("./routers/auth");

const routers = require("./routers"); //  /index yazmamıza gerek yok çünkü index->ana dosya olduğu için
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const CustomError = require("./helpers/error/CustomError");
const path = require("path"); //express paketi içinde

// const PORT = 5000 || process.env.PORT; //Projemizi başka bir yerden yayınladığımız zaman 5000 portu geçersiz olabilir yani bize verilen portu kullanmak zorunda olabiliriz.

//Enviroment Variables
dotenv.config({
    path : "./config/env/config.env"
})

//MongoDb Connection
connectDatabase();

const app = express();

//Express - Body Middleware
app.use(express.json()); //artık postman'den gönderdiğimiz json verileri request.body içinde yer alacak. (express'in kendi middleware'i)
const PORT = process.env.PORT; //config gerçekleştirildikten sonra yazılmalı yoksa hata verir.


//Routers Middleware
//herhangi bir middleware kullanmak için app.use
// app.use("/api/questions",question);
// app.use("/api/auth",auth);

app.use("/api",routers);


//Error Handler  http://expressjs.com/en/guide/error-handling.html#error-handling
// app.use((err,req,res,next) => { //express'in kendi error handling'ini değil kendi error handling'imizi bu şekilde oluşturup kullanabiliriz
//     console.log("Custom Error Handler");

//     res
//     .status(400)
//     .json({
//         success: false
//     })
// })

app.use(customErrorHandler);

//Static Files
console.log(__dirname);
app.use(express.static(path.join(__dirname,"public")));

app.listen(PORT, () => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});
//900