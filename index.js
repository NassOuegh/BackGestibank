const express = require("express");
const app = express();
const cors = require("cors");
var nodemailer = require("nodemailer");

app.use(express.json());

var corsOptions = {
  origin: "*",
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tt858199@gmail.com",
    pass: "poussinbleu",
  },
});

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

//tous les comptes
app.get("/users/list", (req, res) => {
  db.collection("user")
    .find({})
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/users/list/:mail", async (req, res) => {
  const mail = req.params.mail;
  try {
    const docs = await db.collection("user").findOne({ mail });
    res.status(200).json(docs);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

//tous les clients
app.get("/clients/list", (req, res) => {
  db.collection("user")
    .find({ role: "CLIENT" })
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
    .find({ role: "CLIENT", status: "EN ATTENTE" })
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
    .find({ role: "CLIENT", status: "VALIDE" })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/clients/list/:mail", async (req, res) => {
  const mail = req.params.mail;
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
    const accountmail = userData.mail;
    const accountname = userData.name;
    const accountpwd = userData.password;
    const user = await db.collection("user").insertOne(userData);
    res.status(200).json(user);

    var mailOptions = {
      from: "tt858199@gmail.com",
      to: accountmail,
      subject: "Confirmation création de compte",
      text: "Bonjour " + accountname +", \n Vous êtes bien inscrit sur Gestibank. vos identifiants sont: \n Login: "
      +accountmail+"\n Mot de passe: "+accountpwd,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.put("/clients/:mail", async (req, res) => {
  try {
    const mail = req.params.mail;
    const replacementUser = req.body;
    const user = await db
      .collection("user")
      .replaceOne({ mail }, replacementUser);
    //let client = db.find(user=> user.mail==mail);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.delete("/clients/:mail", async (req, res) => {
  try {
    const mail = req.params.mail;
    const user = await db.collection("user").deleteOne({ mail });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.delete("/users/:mail", async (req, res) => {
  try {
    const mail = req.params.mail;
    const user = await db.collection("user").deleteOne({ mail });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// Tous les agents
app.get("/agents/list/", (req, res) => {
  db.collection("user")
    .find({ role: "AGENT" })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/agents/:mail", async (req, res) => {
  const mail = req.params.mail;
  try {
    const docs = await db.collection("user").findOne({ mail });
    res.status(200).json(docs);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// Ajout d'un nouvel agent par l'admin
app.post("/agents/add/", async (req, res) => {
  try {
    const userData = req.body;
    const accountmail = userData.mail;
    const accountname = userData.name;
    const accountpwd = userData.password;
    const newAgent = req.body;
    const addedAgent = await db.collection("user").insertOne(newAgent);
    res.status(200).json(addedAgent);
    var mailOptions = {
      from: "tt858199@gmail.com",
      to: accountmail,
      subject: "Confirmation création de compte",
      text: "Bonjour " + accountname +", \n Vous avez été ajouté comme agent sur Gestibank. Vos identifiants sont: \n Login: "
      +accountmail+"\n Mot de passe: "+accountpwd,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.put("/agents/:mail", async (req, res) => {
  try {
    const mail = req.params.mail;
    const replacementUser = req.body;
    const user = await db
      .collection("user")
      .replaceOne({ mail }, replacementUser);
    //let client = db.find(user=> user.mail==mail);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.delete("/agents/:mail", async (req, res) => {
  try {
    const mail = req.params.mail;
    const user = await db.collection("user").deleteOne({ mail });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

//******************* */  Les API Rest des Admin//******************* */

// Tous les agents
app.get("/admin/list/", (req, res) => {
  db.collection("user")
    .find({ role: "ADMIN" })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

//MAIL//
