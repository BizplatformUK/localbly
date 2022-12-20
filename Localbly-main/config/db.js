var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
require('dotenv').config();
let db;
const connectToDb = (cb)=>{
  const client = new MongoClient(process.env.MONGO_URI);
  try{
    db = client.db('localblyDb');
    return cb()
  }catch(error){
    console.log(error)
    return cb(error)
  }
}
const  getDb = ()=> db;

module.exports = {connectToDb, getDb};