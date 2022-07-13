const asyncErrorWrapper = require("express-async-handler");
const {searchHelper, paginationHelper, populateHelper} = require("./queryMiddlewareHelpers");

//routers
const answerQueryMiddleware = function(model,options){ //bu fonksiyon sadece bir tane middleware fonksiyonunu return edecek 
    return asyncErrorWrapper(async function(req,res,next){//middleware
        const {id} = req.params;
        
        const arrayName = "answers";

        const total = (await model.findById(id))["answerCount"]; //burada bize question gelecek ve bu question içinden answer count'ı alarak aslında total değerimizi bulmuş oluyoruz
        
        // console.log(total);
        const paginationResult = await paginationHelper(total,undefined,req);

        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        //pagination için query.skip'i ve limit'i kullanamıyoruz o yüzden arrayimizi parçalamaya çalışacağız. Bunun için de mongodb'nin bir özelliğini kullanacağız.

        let queryObject = {};

        queryObject[arrayName] = {$slice : [startIndex,limit]} //startindex ve limite göre bir arrayin sadece belli bir bölümünü almamızı sağlayacak. 
        // console.log(queryObject);

        let query = model.find({_id : id},queryObject); //ilk argüman olarak hangi alanların deçilmesi gerektiğini söylüyoruz. _id'yi fonksiyona gönderdiğimiz questionun id'sini yazıyoruz. Bunun bu şekilde kullandığımız zaman questiondaki bütün answerlar gelecek; ancak bunun ikinci argumanı olarak optionslar da verebiliyoruz.
        //optionlarda yukarıda slice'ı kullandığımız için o answers arrayinin belli kısımları gelecek ve pagination'ı da bu şekilde halletmiş olacağız.
        
        query = populateHelper(query,options.population);

        const queryResults = await query;
        res.queryResults = {
            success : true,
            pagination : paginationResult.pagination,
            data : queryResults
        }        
        next();
    });
};

module.exports = {answerQueryMiddleware};