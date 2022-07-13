const searchHelper = (searchKey,query,req) =>{
    if(req.query.search){ //search gelmişse query'yi güncelliyoruz
        const searchObject = {};
        //title searchvalue(title'a göre sorguluyoruz);

        const regex = new RegExp(req.query.search,"i"); //https://javascript.info/regexp-introduction
        searchObject[searchKey] = regex;

        return query = query.where(searchObject);
        //Question.find().where({title:})
    }
    return query;
};

const populateHelper = (query,population) =>{
   return query.populate(population);
};

const questionSortHelper = (query,req) =>{
    
    const sortKey = req.query.sortBy;

    if(sortKey === "most-answered"){
        return query.sort("-answerCount") //answerCount küçükten büyüğe; -answerCount büyükten küçüğe 
    }
    if(sortKey === "most-liked"){
        return query.sort("-likeCount"); //("-likeCount -createAt") like sayısı aynı olursa oluşturulma anına göre sıralanırlar
    }
    return query.sort("-createAt");
};

const paginationHelper = async(totalDocuments,query,req) => {
    
    const page = parseInt(req.query.page) || 1; //string olarak geliyorlar
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page-1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = totalDocuments;

    if(startIndex > 0) {
        pagination.previous = { //önceki sayfanın bilgileri
            page : page-1,
            limit : limit
        }
    }
    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit : limit
        }        
    }
    // console.log(pagination);
    return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit), //mongoose
        pagination : pagination,
        startIndex,
        limit
    }
};

module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
};