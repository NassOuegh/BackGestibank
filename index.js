const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.listen(81, () => {
  console.log("REST API via ExpressJS");
});

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = "gestibank";
let db;
MongoClient.connect(url, function (err, client) {
  console.log("Connexion réussie avec Mongo");
  db = client.db(dbName);
});

app.get("/clients/list", (req, res) => {
  db.collection("user")
    .find({"role": "CLIENT"})
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/clients/list/attente", (req, res) => {
  db.collection("user")
    .find({"role": "CLIENT", "status": "EN ATTENTE"})
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/clients/list/valide", (req, res) => {
  db.collection("user")
    .find({"role": "CLIENT", "status": "VALIDE"})
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/clients/list/:mail", async (req, res) => {
  const mail = parseInt(req.params.mail);
  try {
    const docs = await db.collection("user").findOne({ mail });
    res.status(200).json(docs);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.post("/clients/add", async (req, res) => {
  try {
    const userData = req.body;
    const user = await db.collection("user").insertOne(userData);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.put("/clients/:mail", async (req, res) => {
  try {
    const mail = parseInt(req.params.mail);
    const replacementUser = req.body;
    const user = await db
      .collection("user")
      .replaceOne({ mail }, replacementUser);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.delete("/users/:mail", async (req, res) => {
  try {
    const mail = parseInt(req.params.mail);
    const user = await db.collection("user").deleteOne({ mail });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// Tous les agents
app.get('/agents/list/', (req,res) => {
  db.collection('user').find({"role": "AGENT"}).toArray(function(err, docs) {
      if (err) {
          console.log(err)
          throw err
      }
      res.status(200).json(docs)
    }) 
})

// Ajout d'un nouvel agent par l'admin
app.post('/agents/add/', async (req,res) => {
  try {
          const newAgent = req.body
          const addedAgent = await db.collection('user').insertOne(newAgent)
          res.status(200).json(addedAgent)
      } catch (err) {
          console.log(err)
          throw err
      } 
})


//******************* */  Les API Rest des Admin//******************* */

// Tous les agents
app.get('/admin/list/', (req,res) => {
  db.collection('user').find({"role": "ADMIN"}).toArray(function(err, docs) {
      if (err) {
          console.log(err)
          throw err
      }
      res.status(200).json(docs)
    }) 
})
