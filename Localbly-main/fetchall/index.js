
const {connectToDb, getDb} = require('../config/db');

connectToDb((err)=> {
  if(err) return;
})

async function fetchBiz(context, req) {
  const db = getDb()
  const allBiz = await db.collection('businesses').find();
  const res = await allBiz.toArray()
  return await context.res.status(200).json(res);
  
}


module.exports = {fetchBiz}
    