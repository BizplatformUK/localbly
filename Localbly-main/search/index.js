
const fn = require('../config/dbFunctions');


async function searchCategories(context,req){
    const body = req.body || req.query;
    let collection
    collection = body.collection;
    const term = context.bindingData.term;
    const params = {searchTags: new RegExp(term, 'i')}
    try{
        const results = await fn.search(params, collection);
        if(results){
            return await context.res.status(200).json(results);
        } else{
            context.res.status(400).json({message:'no results found'})
        }
    }catch(error){
        context.log.error(error.message);
        context.res.status(400).json({message:error.message})
    }
}

module.exports =  {searchCategories}