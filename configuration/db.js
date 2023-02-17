const { MongoClient } = require("mongodb");
//require('dotenv').config();

//const { error } = require("winston");

const _uri = process.env.MONGODB_URL;
//'mongodb+srv://helloDark:darkHello121212@tempproject.c6k0j.mongodb.net/true_Examinee?retryWrites=true&w=majority';

const dbCon = (coll,cb,coll2)=>{
    MongoClient.connect(_uri)
    .then(async (client) =>{
        const db = client.db('true_Examinee').collection(coll);
        let db2
        if(coll2){
            db2 = client.db('true_Examinee').collection(coll2);
        }
        await cb(db,db2);
        client.close();
    }).catch(err =>{ console.log(err)});
};

module.exports = dbCon;