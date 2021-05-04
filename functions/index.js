const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();
// const db = admin.firestore();
const app = express();
app.use(cors({origin: true}));

app.get("/", async (req, res) => {
  const response = await db.collection("general").get();
  res.status(200).send(response);
});

app.post("/", async (req, res) => {
  const user =
    {
      firstname: req.body["firstname"],
      lastname: req.body["lastname"],
      gender: req.body["gender"],
      email: req.body["email"],
      age: req.body["age"],
      applicationType: req.body["applicationType"],
      resume: req.body["resume"],
    };
  await db.collection("general")
      .doc("applicants")
      .collection("volunteers")
      .add(user);
  res.status(201).send();
});


exports.user = functions.https.onRequest(app);
exports.response = functions.https.onRequest(app);

