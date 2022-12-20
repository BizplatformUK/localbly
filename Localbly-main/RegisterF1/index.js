const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');


async function Register(context, req){
  const body = req.body || req.body || req.query;
  if(!(body.name && body.email && body.password )){
    await context.res.status(400).send({ message: "input fields cannot be empty" });
    return -1;
  }

  const findBiz = await fn.checkifEmpty({'email':body.email}, 'businesses')
  if(findBiz){
    await context.res.status(200).json({ message: "An account with this email already exists please use another", code:2});
    return -1
  }
  
  let salt,token;
  try{
    salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(body.password, salt);
    token = auth.generateAccessToken(body.email);
    const id = auth.generateID();
    let params = {
      "_id": id,
      "name": body.name,
      "email": body.email,
      "bizname": body.biz,
      "type":body.type,
      "category":body.category,
      "location":body.location,
      "logo":null,
      "twitter":null,
      "facebook":null,
      "instagram":null,
      "overview":null,
      "coverImg":null,
      "password": password
    }
    
      const insert = await fn.insertToDB(params, 'businesses')
      if(insert){
        return await context.res.status(200).json({ message: "account created", id:params._id, user:params.name, biz:params.bizname, code:0});
      }
  }catch(err){
    context.log.error(err.message);
    context.res.status(400).json({message:err.message})
  }


}
module.exports =  {Register}
