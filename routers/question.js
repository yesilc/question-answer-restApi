const express = require("express");
const {askNewQuestion , getAllQuestions , getSingleQuestion , editQuestion , deleteQuestion , likeQuestion , undolikeQuestion} = require("../controllers/question")
// const que = require("../controllers/question");
const {getAccessToRoute , getQuestionOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers");
const {questionQueryMiddleware} = require("../middlewares/query/questionQueryMiddleware");
const {answerQueryMiddleware} = require("../middlewares/query/answerQueryMiddleware");
const Question = require("../models/Question");

const answer = require("./answer");

const router = express.Router();



// router.get("/",que.getAllQuestions);
router.get("/",questionQueryMiddleware(Question,{
    population : {
        path : "user",
        select : "name profile_image"
    }
}),getAllQuestions);
router.get("/:id",checkQuestionExist,answerQueryMiddleware(Question,{population : 
    [
        {
            path : "user",
            select : "name profile_image"
        },
        {
            path : "answers",
            select : "content"
        }
    ]
}),getSingleQuestion)
router.get("/:id/like",[getAccessToRoute,checkQuestionExist],likeQuestion)
router.get("/:id/undo_like",[getAccessToRoute,checkQuestionExist],undolikeQuestion);
router.post("/ask",getAccessToRoute,askNewQuestion);
router.put("/:id/edit",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion)//ilk önce kullanıcının giriş yapması gerekiyor, sonra question id kontrol ediliyor
router.delete("/:id/delete",[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);

router.use("/:question_id/answers",checkQuestionExist,answer); //index.js'de yazmıyoruz çünkü answer, question'a bağlı
//answerlarla da iş yapacağımız için id'ler karışmasın diye question_id şeklinde gönderiyoruz
//bir üst routerdan bir alt router olan answer'ı çağırdık ve express'in doğası gereği bu question id direkt olarak answera geçemiyor

module.exports = router;