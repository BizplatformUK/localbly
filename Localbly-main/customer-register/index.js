const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');


async function customerRegister(context,req){
    const body = req.body || req.body || req.query;

    if(!(body.name && body.email && body.password )){
        await context.res.status(400).send({ message: "input fields cannot be empty" });
        return -1;
    }

    const findCustomer = await fn.checkifEmpty({"email":body.email}, 'customers');
    if(findCustomer){
        await context.res.status(200).json({ message: "An account with this email alread exists please use another"});
        return -1
    }
    let salt,token;
    try{
        salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(body.password, salt);
        token = auth.generateAccessToken(body.email);
        const id = auth.generateID()
        let params = {
            "_id": id,
            "name": body.name,
            "email": body.email,
            "phone_number": body.number,
            "password": password
        }
     const insert = await fn.insertToDB(params, 'customers');
     if(insert.message = 'success'){
        return await context.res.status(200).json({ message: "account created",token:token, id:params._id, user:params.name, number:params.phone_number, code:1});
     }

    }catch(err){
        context.log.error(err.message);
        context.res.status(400).json({message:err.message})
    }

}

module.exports =  {customerRegister}