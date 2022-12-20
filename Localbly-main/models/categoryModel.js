const mongoose = require('mongoose')
const {Schema} = mongoose;
const uniquValidator = require('mongoose-unique-validator');
require('dotenv').config();


const categorySchema = new Schema ({
    bizId:{
      type:String, 
      required:true
    },
    name:{
      type:String,
      required:true,
      unique:true
    },
   
    picture:{
      type:String,
      required:true,
      unique:true
    },
  
    
    date:{
      type:Date,
      default:Date.now()
    }
  
  });
  const CATEGORY = mongoose.model("categories", categorySchema)
  categorySchema.plugin(uniquValidator, {message: "category already exists"})
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    
  console.log('connected to db ')
  
})
.catch((error)=>{
    console.log(error)
});

module.exports = CATEGORY;