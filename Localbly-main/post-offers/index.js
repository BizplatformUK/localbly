const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');

async function postOffers(context, req){
    const body = req.body || req.body || req.query;
    const verifyToken = auth.authenticateToken(body.token)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const empty = await fn.checkifEmpty({"offer":body.name}, 'offers')
        if(empty){
            context.res.status(400).json({ message: "This offer already exists use a different name" });
        }
        const biz = await fn.findOne({'_id':body.bizid}, 'businesses');
        const id = auth.generateID()
        let  params = {
            "_id":id,
            "biz": biz.bizname,
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
        const insert = await fn.insertToDB(params, 'offers');
        if(insert){
            context.res.status(200).json({message:'Offer created successfully', code:0, id:params._id});
        }
        

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports =  {postOffers}