const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');


async function postProduct(context, req){
    const body = req.body || req.body;
    const verifyToken = auth.authenticateToken(body.token)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    const biz = await fn.findOne({"_id":body.bizid}, 'businesses');
    const findProduct = await fn.checkifEmpty({"biz":biz.bizname, "name":body.name}, 'products')
    if(findProduct){
        await context.res.status(400).send({ message: "Product Arleady exists" });
        return -1
    }
    const category = await fn.findOne({"_id":body.catid, "biz":biz.bizname}, 'categories')
    const collection = await fn.findOne({"_id":body.colid, "biz":biz.bizname}, 'collections')
    try{
        const id = auth.generateID()
        const slug = auth.slugify(body.name);
        const tags = [body.name, category.slug, collection.slug];
        let data = {
            "_id": id,
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
            "searchTags": tags,
            "date": Date.now()
        }
        if(body.offer !== null){
            const offer = await fn.findOne({'_id':body.offer}, 'offers');
            data.marketing = offer.offerName;
            const discount = offer.discount;
            const discountPrice = auth.getDiscountPrice(body.price, discount);
            data.newPrice = discountPrice;
            const type = offer.offer_type;
            if(type == 'coupon'){
                data.offerDetails = {code:offer.couponCode,  validFrom:offer.validFrom, validTo:offer.validTo}
            } else{
                data.offerDetails = {validFrom:offer.validFrom,  validTo:offer.validTo}
            }
          
        }
        const insert = await fn.insertToDB(data, 'products');
        if(insert){
            await context.res.status(200).json({ message: "Product uploaded successfully", code:1, id:data._id});
        }
    }catch(error){
        context.log.error(error.message);
        context.res.status(400).json({message:error.message})
    }
}

module.exports =  {postProduct}