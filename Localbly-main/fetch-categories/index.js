const fn = require('../config/dbFunctions');

async function getBizCategories(context, req){
    const id = context.bindingData.id;
    const biz = await fn.findOne({'_id':id}, 'businesses');
    if(!biz){
        await context.res.status(404).json({error: 'Sorry but the business you are looking for is not in our database'})
        return -1;
    }
    try{
        const categories = await fn.fetchData({biz:biz.bizname}, 'categories');
        if(categories){
            const results = [];
            categories.forEach(category=> {
                results.push(category);
            })
            return await context.res.status(200).json(results);
        }
    }catch(error){
        context.log.error(error.message);
        context.res.status(400).json({message:error.message})
    }

}

module.exports =  {getBizCategories}