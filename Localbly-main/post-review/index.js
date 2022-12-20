const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function postReview(context,req){
    const body = req.body || req.body || req.query;

    const verifyToken = jwt.verify(body.token, process.env.SECRET)
    if(!verifyToken){
        await context.res.status(400).send({ message: "Access denied" });
        return -1;
    }
    try{
        const customer = await fn.findOne({"_id":body.id}, 'customers');
        const id = auth.generateID()
        const params = {
            "_id": id,
            "name":customer.name,
            "biz": body.biz,
            "rating":body.rate,
            "review":body.review,
        }
        const insert = await fn.insertToDB(params, 'reviews');
        if(insert){return await context.res.status(200).json({ message: "Review posted successfully",code:0});}

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }
}

module.exports = {postReview}