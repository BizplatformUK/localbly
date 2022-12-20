const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');

async function deleteOffer(context, req){
    const body = req.body || req.query;

    const biz = await fn.findOne({"_id":body.bizid}, 'businesses');
    const findOffer = await fn.checkifEmpty({"_id":body.id}, 'offers');
    if(!findOffer){
        await context.res.status(400).send({ message: "Category not found in database" });
        return -1;
    }

    const verifyToken = auth.authenticateToken(body.token);
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const params = {"_id":body.id, "biz":biz.bizname}
        const deleteItem = await fn.deleteData(params, 'offers');
        if(deleteItem){
            return await context.res.status(200).send({ message: "Offer deleted successfully", code:0});
        }

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports =  {deleteOffer}