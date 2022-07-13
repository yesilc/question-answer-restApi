const asyncErrorWrapper = require("express-async-handler");
const {searchHelper, paginationHelper} = require("./queryMiddlewareHelpers");

const userQueryMiddleware = function(model,options){ //bu fonksiyon sadece bir tane middleware fonksiyonunu return edecek 
    return asyncErrorWrapper(async function(req,res,next){//middleware
        
        let query = model.find();

        //search by name
        query = searchHelper("name",query,req); //userları name'e göre arayacağız

        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await query; //üstteki işlemlere göre user gelecek
        res.queryResults = {
            success : true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        };
        next();
    });
};

module.exports = {userQueryMiddleware};