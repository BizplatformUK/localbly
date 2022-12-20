const fn = require('../config/dbFunctions');

async function getCollections(context,req){
    const id = context.bindingData.id;
    const biz = await fn.findOne({'_id':id}, 'businesses');
    if(!biz){
        await context.res.status(404).json({error: 'Sorry but the business you are looking for is not in our database'})
        return -1;
    }
    try{
        const collections = await fn.fetchData({biz:biz.bizname}, 'collections');
        if(collections){
            const results = [];
            collections.forEach(collection=> {
                results.push(collection);
            })
            return await context.res.status(200).json(results);
        }

    }catch(error){
        context.log.error(error.message);
        context.res.status(400).json({message:error.message})
    }
}

module.exports = {getCollections}
