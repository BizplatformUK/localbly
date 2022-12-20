const fn = require('../config/dbFunctions');
const auth = require('../middleware/auth');
require('dotenv').config();

async function postCollection(context,req){
    const body = req.body || req.body;

    const verifyToken = auth.authenticateToken(body.token)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    const findCollection = await fn.checkifEmpty({name:body.name}, 'collections');
    if(findCollection){
        await context.res.status(400).send({ message: "This collection name already exists, use a different name" });
        return -1;
    } 
    try{
        const id = auth.generateID()
        const slug = auth.slugify(body.name);
        const biz = await fn.findOne({_id:body.bizid}, 'businesses');
        let data = {
            "_id": id,
            "biz": biz.bizname,
            "slug":slug,
            "name": body.name,
            "date": Date.now()
        }
        const insert = await fn.insertToDB(data, 'collections')
        if(insert){
            await context.res.status(200).json({ message: "collection uploaded successfully", code:1, id:data._id});
        }

    }catch(error){
        context.log.error(error.message);
        context.res.status(400).json({message:error.message})
    }


}

module.exports = {postCollection}
