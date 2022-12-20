const mongoose = require('mongoose')
const uniquValidator = require('mongoose-unique-validator');
const {Schema} = mongoose;
require('dotenv').config();

const bizSchema = new Schema ({
  bizname:{
    type:String, 
    required:true
  },
  name:{
    type:String,
    required:true
  },
 
  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true,
  },
  
  location:{
    type:String,
    required:false
  },

  type:{
    type:String,
    required:false
  },
  category:{
    type:String,
    required: false
  },
  rating:{
    type:String,
    required:false
  },
  
  date:{
    type:Date,
    default:Date.now()
  }

});

bizSchema.set("toJSON", {
  transform: (document, returnedObject)=> {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject. _id;
    
  }
})

bizSchema.plugin(uniquValidator, {message: "email already exists"})

const User = mongoose.model("user", bizSchema)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    
  console.log('connected to db ')
  
})
.catch((error)=>{
    console.log(error)
});

module.exports = User;
