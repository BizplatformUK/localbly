const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const {StorageSharedKeyCredential, ContainerSASPermissions, generateBlobSASQueryParameters} = require("@azure/storage-blob");
const { extractConnectionStringParts } = require('./utils.js');
require('dotenv').config();

function authenticateToken(token){
    if(token == null)
    return {message:'access denied', code:-1}

    const verifyToken = jwt.verify(token, process.env.SECRET)
    if(!verifyToken){
        return false
    }
    return true
}

function generateAccessToken(_id){
    return jwt.sign({_id}, process.env.SECRET)
}

function generateRandomStringd() {
    return Math.random().toString(26).substr(2, 5);
}

function getAbbreviation(text) {
    if (typeof text != 'string' || !text) {
      return '';
    }
    const acronym = text
      .match(/[\p{Alpha}\p{Nd}]+/gu)
      .reduce((previous, next) => previous + ((+next === 0 || parseInt(next)) ? parseInt(next): next[0] || ''), '')
      .toUpperCase()
    return acronym;
}

/* creates a slug from a string, used to create slugs from names */
function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

function generateID(){
    return uuidv4();
}

function generateSasToken(connectionString, container, permissions) {
    const { accountKey, accountName, url } = extractConnectionStringParts(connectionString);
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey.toString('base64'));

    var expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 2);

    const sasKey = generateBlobSASQueryParameters({
        containerName: container,
        permissions: ContainerSASPermissions.parse(permissions),
        expiresOn: expiryDate,
    }, sharedKeyCredential);

    return {
        sasKey: sasKey.toString(),
        url: url
    };
}

function getDiscountPrice(origPrice, discount){
    let discountTotal = (discount/100)*origPrice;
    let discountPrice = (origPrice - discountTotal);

    return discountPrice;
}

module.exports = {
    authenticateToken, 
    generateAccessToken, 
    generateRandomStringd, 
    getAbbreviation,
    slugify,
    generateID,
    generateSasToken,
    getDiscountPrice
}