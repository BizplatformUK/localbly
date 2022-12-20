const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');

async function customerLogin(context, req){
    const body = req.body || req.body || req.query;

  try{
    let login
    if(!(body.number)){
        login = {email:body.email};
    } else{
        login = {phone_number:body.number};
    }
    const customer = await fn.findOne(login, 'customers');
    if(!customer){
       await context.res.status(401).json({ error: "User does not exist", code:1 });
       return 1
    }
    const validPassword = await bcrypt.compare(body.password, customer.password);
    if(!validPassword){
        await context.res.status(400).json({ error: "Invalid Password", code: 2 });
        return 2
    }
    const token = auth.generateAccessToken(customer.email);
    const id = (customer.id);
    const name= (customer.name);
    const email = (customer.email);
    const number = (customer.number);
    context.res.status(200).json({ message: "Valid password",                               
        email:email,
        username:name,
        number:number,
        token:token,
        id:id,
        code:0                                  
    });

  }catch(err){
    context.log.error(err.message);
    context.res.status(400).json({message:err.message})
 }


}

module.exports =  {customerLogin}