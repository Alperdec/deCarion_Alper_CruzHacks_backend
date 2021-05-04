const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
// const db = admin.firestore();
const app = express();
app.use(cors({origin: true}));

app.post("/", async (req, res) => {
  const user = req.body;
  await admin.firestore().collection("users").add(user);
  res.status(201).send();
});

app.post("/", async (req, res) => {
  const application = req.body;
  await admin.firestore().collection("applications").add(application);
  res.status(201).send();
});

exports.user = functions.https.onRequest(app);
exports.application = functions.https.onRequest(app);
