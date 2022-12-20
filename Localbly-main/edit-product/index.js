const auth = require('../middleware/auth');
require('dotenv').config();
const {connectToDb, getDb} = require('../config/db');
const jwt = require('jsonwebtoken');

connectToDb((err)=> {
    if(err) return
})

async function editProduct(context, req){
    const body = req.body || req.query;
    const db = getDb()
    const biz = await db.collection('businesses').findOne({"_id":body.bizid})

    const findProducts = await db.collection('products').find({"_id":body.id, biz:biz.bizname});
    if(!findProducts){
        await context.res.status(400).send({ message: "Category not found in database" });
        return -1;
    }
    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    const category = await db.collection('categories').findOne({"_id":body.catid, "biz":biz.bizname})
    const collection = await db.collection('collections').findOne({"_id":body.colid, "biz":biz.bizname})
    try{
        const slug = auth.slugify(body.name);
        const data = {
            "biz": biz.bizname,
            "slug":slug,
            "name": body.name,
            "sku":body.sku,
            "price":body.price,
            "qty":body.qty,
            "category":category.slug,
            "collection":collection.slug,
            "description": body.description,
            "picture":body.picture,
        }
        const update = await db.collection('products').updateOne({"_id":body.id}, {$set:data})
        if(update){await context.res.status(200).json({ message: "Category update successfully", code:1});}

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports = {editProduct}