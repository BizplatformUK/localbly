const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const fn = require('../config/dbFunctions');
require('dotenv').config();


async function postCategory(context, req){
    const body = req.body || req.body;

    const verifyToken = auth.authenticateToken(body.token)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    const category = await fn.checkifEmpty({name:body.name}, 'categories');
    if(category){
        await context.res.status(400).send({ message: "Category Arleady exists" });
        return -1
    }
   
   try{
    const id = auth.generateID()
    const slug = auth.slugify(body.name);
    const biz = await fn.findOne({_id:body.bizid}, 'businesses');
    const tags = body.tags.split(',');
    tags.unshift(body.name)
    const data = {
        "_id": id,
        "biz":biz.bizname,
        "name":body.name,
        "slug":slug,
        "searchTags": tags,
        "picture":body.picture,
        "date":Date.now()
    }
    const insert = await fn.insertToDB(data, 'categories')
    if(insert){
        await context.res.status(200).json({ message: "Category uploaded successfully", code:1, id:data._id});
    }
   }catch(error){
    context.log.error(error.message);
    context.res.status(400).json({message:error.message})
   }

}

module.exports =  {postCategory}