const {connectToDb, getDb} = require('./db');

connectToDb((err)=> {
    if(err) return
})
var db = getDb()
async function checkifEmpty(params, collection){
    const db = getDb()
   
    const check = await db.collection(collection).findOne(params)
    if(check){
        return true
    } else{
        return false
    }

}

async function findOne(params, collection){
    const db = getDb();

    const find = await db.collection(collection).findOne(params)
    if(!find) return{message:'nothing found', code:1}
    return find
}

async function insertToDB(params,collection){
    const db = getDb()

    const insert = await db.collection(collection).insertOne(params);
    if(insert){
        return {message:'Success'}
    } else{
        return {message:'failed to insert to db'}
    }
}

async function updateData(value, params, collection){
    const db = getDb();
    const update = await db.collection(collection).updateOne({"_id":value}, {$set:params});
    if(!update){
        return {message:'failed to update'}
    }
    return {message:'Update success'}
}

async function deleteData(params, collection){
    const deleteItem = await db.collection(collection).deleteOne(params)
    if(!deleteItem){
        return {message:'failed to delete'}
    }
    return {message:'Item deleted successfully'}

}

async function fetchData(params, collection){
    const fetch = await db.collection(collection).find(params)
    if(!fetch){
        return {message:'data not found'}
    }

    const data = await fetch.toArray()
    return data
}

async function fetchSingleItem(params, collection){
    const item = await db.collection(collection).find(params);
    if(!item){
        return {message:'item not found'}
    }
    return item
}

async function search(params, collection){
    const items = await db.collection(collection).find(params);
    if(!items){
        return {message:'nothing found'}
    }
    let data = []
    await items.forEach(item=> {
        const results = {id:item._id, name:item.name}
        data.push(results)
    })
    //const data = await items.toArray()
    return data;
}
module.exports = {checkifEmpty, insertToDB, findOne, updateData, deleteData, fetchData, fetchSingleItem, search}