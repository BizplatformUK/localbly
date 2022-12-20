const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {connectToDb, getDb} = require('../config/db');

connectToDb((err)=> {
    if(err) return
})

async function deleteProduct(context, req){
    const body = req.body || req.query;
    const db = getDb();

    const biz = await db.collection('businesses').findOne({"_id":body.bizid})
    const findProduct = await db.collection('products').find({"_id":body.id, "biz":biz.bizname});
    if(!findProduct){
        await context.res.status(400).send({ message: "Category not found in database" });
        return -1;
    }
    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const data = {"_id":body.id, "biz":biz.bizname}
        const del = await db.collection('products').deleteOne(data)
        if(del){
            await context.res.status(200).json({ message: "Product Deleted successfully", code:1})
        }

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports =  {deleteProduct}