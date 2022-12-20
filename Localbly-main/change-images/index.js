const jwt = require('jsonwebtoken');
const fn = require('../config/dbFunctions');

async function changeImages(context,req){
    const body = req.body || req.query;
    const findBiz = await fn.findOne({"_id":body.id}, 'businesses');
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
        params = {"coverImg":body.coverimg}
        const updateUser = await fn.updateData(body.id, params, 'businesses')
        if(updateUser){
            await context.res.status(200).json({ message: "Account update successfully", pic:body.coverimg, code:1});
        }
    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports =  {changeImages}
