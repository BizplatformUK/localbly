
const {connectToDb, getDb} = require('../config/db');

connectToDb((err)=> {
  if(err) return;
})

async function fetchSingleBiz(context, req){
  const id = context.bindingData.id;
  const db = getDb()
  const biz = await db.collection('businesses').findOne({_id:id});
  if(!biz){
    await context.res.status(404).json({error: 'Sorry but the business you are looking for is not in our database'})
    return -1;
  }
  let data = {
    id:biz._id,
    name:biz.name,
    email:biz.email,
    bizname:biz.bizname,
    type:biz.type,
    category:biz.category,
    location:biz.location,
    logo:biz.logo,
    twitter:biz.twitter,
    facebook:biz.facebook,
    instagram:biz.instagram,
    overview:biz.overview,
    coverImg:biz.coverImg
  }
  return await context.res.status(200).json(data);
}

module.exports =  {fetchSingleBiz}