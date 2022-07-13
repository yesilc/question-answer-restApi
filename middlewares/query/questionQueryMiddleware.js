const asyncErrorWrapper = require("express-async-handler");
const {searchHelper, populateHelper, questionSortHelper, paginationHelper} = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function(model,options){ //bu fonksiyon sadece bir tane middleware fonksiyonunu return edecek 
    return asyncErrorWrapper(async function(req,res,next){//middleware
        //Initial Query
        let query = model.find();//let olarak vermemizin nedeni sonradan güncelleyecek olmamız

        //serch   search işleminini burada yazabiliriz ama biz bunu diğer middlewarelerde de kullanmak için helper fonksiyon şeklinde yazacağız
        query = searchHelper("title",query,req); //request'ten search value'yu alacağız
        
        if(options && options.population){ //options undefined değilse ve options'ın içinde population varsa
            query = populateHelper(query,options.population);
        }
        //sort
        query = questionSortHelper(query,req);
        
        //pagination
        //helper'da await yapısı kullandığımız için burada da await yapsını kullanmamız gerekiyor
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        
        const queryResults = await query;

        res.queryResults = { // elde ettiğimiz queryResult'ı routers'larda kullanılması için bizim bu queryResuştı bir yere koymamız gerekiyor. bunu da response'a koyuyoruz.
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        }
        next(); //middleware
    });
};

module.exports = {questionQueryMiddleware};