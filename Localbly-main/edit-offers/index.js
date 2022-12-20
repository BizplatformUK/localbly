const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');
const jwt = require('jsonwebtoken');

async function editOffers(context, req){
    const body = req.body || req.query;

    const findOffer = await fn.checkifEmpty({"_id":body.id}, 'offers');
    if(!findOffer){
        await context.res.status(400).send({ message: "Category not found in database" });
        return -1;
    }

    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        let params = {
            "bgimg":body.img,
            "description":body.description,
            "offer_type": body.type,
            "discount":body.discount,
            "offerName": body.name,
            "couponCode": null,
            "validFrom": body.fromDate,
            "validTo": body.endDate,
            "qty": null
        }
        if(body.type == 'coupon'){
            params.couponCode = body.code;
            params.qty = body.qty
        }

        const update = await fn.updateData(body.id, params, 'offers');
        if(update){
            return await context.res.status(200).send({ message: "Offer Updated successfully", code:0});
        }

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports =  {editOffers}