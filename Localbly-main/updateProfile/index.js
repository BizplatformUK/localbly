const jwt = require('jsonwebtoken');
const fn = require('../config/dbFunctions');
require('dotenv').config();

async function updateProfile(context,req){
    const body = req.body || req.query;
    const findBiz = await fn.findOne({"_id":body.id}, 'businesses')
    if(!findBiz){
        await context.res.status(400).send({ message: "User not found: it seems you do not have a localbly account" });
        return -1;
    }
    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const params = {
            "name":body.name,
            "email":body.email,
            "bizname":body.biz,
            "type":body.type,
            "category":body.category,
            "location":body.location,
            "twitter":body.twitter,
            "facebook":body.fb,
            "instagram":body.insta,
            "overview":body.overview,
        }
        const updateUser = await fn.updateData(body.id, params, 'businesses')
        if(updateUser){
            await context.res.status(200).json({ message: "Account update successfully", code:1});
        }
    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports = { updateProfile }