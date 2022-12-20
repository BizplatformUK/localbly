const auth = require('../middleware/auth');
require('dotenv').config();
const {connectToDb, getDb} = require('../config/db');
const jwt = require('jsonwebtoken');

connectToDb((err)=> {
    if(err)return
})

async function deleteCategories(context,req){
    const body = req.body || req.query;
    const db = getDb();

    const findCategory = await db.collection('categories').find({"_id":body.id});
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
        const idArray = body.ids.split(',')
        const data = { _id:{$in:idArray}};
        const del = await db.collection('categories').deleteMany(data)
        if(del){await context.res.status(200).json({ message: "Categories Deleted successfully", code:1})}

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}
module.exports = {deleteCategories}