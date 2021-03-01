const express = require('express')
const app = express()


app.listen(85, ()=>{console.log('REST API via ExpressJS')})

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = "gestibank";
let db
MongoClient.connect(url,function(err,client){
    console.log("Connexion réussie avec Mongo");
    db = client.db(dbName);
})

app.get('/users', (req,res)=>{
    db.collection('user').find({}).toArray(function(err, docs){
        if (err) {
            console.log(err)
            throw (err)
        }
        res.status(200).json(docs)
    })
})

app.get('/users/:id', async (req,res)=>{
    const id= parseInt(req.params.id)
    try {
        const docs = await db.collection('user').findOne({id})
        res.status(200).json (docs)
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.post('/users', async (req,res)=>{
    try {
        const userData = req.body
        const user = await db.collection('user').inserOne(userData)
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.put('/users/:id', async (req,res)=>{
    try {
        const id = parseInt(req.params.id)
        const replacementUser = req.body
        const user = await db.collection('user').replaceOne({id}, replacementUser)
        res.status(200).json(user)
    } catch (err){
    console.log(err)
    throw err 
    }
})

app.delete ('/users/:id', async (req,res)=> {
    try {
        const id = parseInt(req.params.id)
        const user = await db.collection('user').deleteOne({id})
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
})
