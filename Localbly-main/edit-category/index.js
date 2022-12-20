const auth = require('../middleware/auth');
require('dotenv').config();
const {connectToDb, getDb} = require('../config/db');
const jwt = require('jsonwebtoken');

connectToDb((err)=> {
    if(err) return
});

async function editCategory(context,req){
    const body = req.body || req.query;
    const db = getDb()
    const biz = await db.collection('businesses').findOne({"_id":body.bizid})

    const findCategory = await db.collection('categories').find({"_id":body.id, biz:biz.bizname});
    if(!findCategory){
        await context.res.status(400).send({ message: "Category not found in database" });
        return -1;
    }
    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const slug = auth.slugify(body.name);
        const data = {
            "name":body.name,
            "slug":slug,
            "picture":body.picture
        }
        const update = await db.collection('categories').updateOne({"_id":body.id}, {$set:data})
        if(update){await context.res.status(200).json({ message: "Category update successfully", code:1});}

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }

}

module.exports =  {editCategory}