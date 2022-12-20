require('dotenv').config();
const auth = require('../middleware/auth');

async function uploadPicture(context, req){
    const permissions = 'c';
    const container = 'images';

    context.res = {body:auth.generateSasToken(process.env.AzureWebJobsStorage, container, permissions)};
    context.done();
}

module.exports =  {uploadPicture}