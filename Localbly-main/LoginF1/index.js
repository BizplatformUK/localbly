const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const fn = require('../config/dbFunctions');
require('dotenv').config();

async function Login(context,req){
  const body = req.body || req.query ;

  const user = await fn.findOne({ email: body.email }, 'businesses');
  const permissions = 'c';
  const container = 'images';
try{
      if (user) {
        // check user password with hashed password stored in the database
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (validPassword) {
          const token = auth.generateAccessToken(user.email);
          const id = user._id;

          let bizname= user.bizname;
          let location = user.location;
          let name = user.name;
          const imgKeys = {body:auth.generateSasToken(process.env.AzureWebJobsStorage, container, permissions)}

          context.res.status(200).json({ message: "Valid password", 

                                               location:location,
                                               username:name,
                                               bizname:bizname,
                                               token:token,
                                               id:id,
                                               code:0,
                                               accessKeys: imgKeys.body
                                              });
        } else {
          context.res.status(400).json({ error: "Invalid Password", code:2 });
        }
      } else {
        context.res.status(401).json({ error: "User does not exist", code:2});
      }
 }catch(error)
   context.res.status(500).json({ error: error.message});
}
module.exports = {Login}
