const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// index.js is a REST API with endpoints implemented 
// using firebase functions and deployed to cloud
// hence "serverless" implementation

admin.initializeApp();
const db = admin.firestore();
// const db = admin.firestore();
const app = express();
app.use(cors({origin: true}));

app.get("/", async (req, res) => {
  // get all applicants
  const snapshot1 = await db.collection("general")
      .doc("applicants")
      .collection("volunteers").get();
  const snapshot2 = await db.collection("general")
      .doc("applicants")
      .collection("hackers").get();

  const applicants = [];

  snapshot1.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    applicants.push({id, ...data});
  });
  snapshot2.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    applicants.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(applicants));
});

app.get("/hackers", async (req, res) => {
  // get all hackers

  const snapshot = await db.collection("general")
      .doc("applicants")
      .collection("hackers").get();

  const hackers = [];

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    hackers.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(hackers));
});

app.get("/volunteers", async (req, res) => {
  // get all volunteers

  const snapshot = await db.collection("general")
      .doc("applicants")
      .collection("volunteers").get();

  const volunteers = [];

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    volunteers.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(volunteers));
});

app.post("/", async (req, res) => {
  const applicant = req.body;
  if (req.body["applicationType"] === "Volunteer") {
    await db.collection("general")
        .doc("applicants")
        .collection("volunteers")
        .add(applicant);
    res.status(201).send();
  } else if (req.body["applicationType"] === "Hacker") {
    await db.collection("general")
        .doc("applicants")
        .collection("hackers")
        .add(applicant);
    res.status(201).send();
  } else {
    res.status(500).send("invalid application type");
  }
});

exports.applicant = functions.https.onRequest(app);

