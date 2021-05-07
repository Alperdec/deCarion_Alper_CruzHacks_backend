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

app.get("/general/applicants/hackers", async (req, res) => {
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

app.get("/general/applicants/volunteers", async (req, res) => {
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

app.get("/:id", async (req, res) => {
  // get applicant by email(id)
  const snapshot1 = await db.collection("general")
      .doc("applicants")
      .collection("volunteers").get();
  const snapshot2 = await db.collection("general")
      .doc("applicants")
      .collection("hackers").get();

  let user = {};

  snapshot1.forEach((doc) => {
    if (doc.id === req.params.id) {
      const data = doc.data();
      const id = doc.id;
      user = {id, ...data};
    }
  });
  snapshot2.forEach((doc) => {
    if (doc.id === req.params.id) {
      const data = doc.data();
      const id = doc.id;
      user = {id, ...data};
    }
  });
  res.status(200).send(JSON.stringify(user));
});

app.put("/:id", async (req, res) => {
  // update applicant
  const body = req.body;
  delete body.email;
  delete body.applicationType;
  const ref1 = db.collection("general")
      .doc("applicants")
      .collection("volunteers").doc(req.params.id);
  const ref2 = db.collection("general")
      .doc("applicants")
      .collection("hackers").doc(req.params.id);

  await ref1.get()
      .then((snapshot) => {
        if (snapshot.exists) {
          ref1.update(req.body);
          res.status(200).send(`${req.params.id}
                                successfully updated with
                                ${JSON.stringify(body)}`);
        }
      });
  await ref2.get()
      .then((snapshot) => {
        if (snapshot.exists) {
          ref2.update(req.body);
          res.status(200).send(`${req.params.id}
                                successfully updated with
                                ${JSON.stringify(body)}`);
        }
      });
});

app.delete("/:id", async (req, res) => {
  // remove applicant
  const ref1 = db.collection("general")
      .doc("applicants")
      .collection("volunteers").doc(req.params.id);
  const ref2 = db.collection("general")
      .doc("applicants")
      .collection("hackers").doc(req.params.id);

  await ref1.get()
      .then((snapshot) => {
        if (snapshot.exists) {
          ref1.delete();
          res.status(200).send(`${req.params.id} 
                              successfully removed from volunteers`);
        }
      });
  await ref2.get()
      .then((snapshot) => {
        if (snapshot.exists) {
          ref2.delete();
          res.status(200).send(`${req.params.id} 
                                successfully removed from hackers`);
        }
      });
});

app.post("/", async (req, res) => {
  const applicant = req.body;
  if (req.body["applicationType"] === "Volunteer") {
    await db.collection("general")
        .doc("applicants")
        .collection("volunteers")
        .doc(req.body["email"])
        .set(applicant);
    res.status(201).send();
  } else if (req.body["applicationType"] === "Hacker") {
    await db.collection("general")
        .doc("applicants")
        .collection("hackers")
        .doc(req.body["email"])
        .set(applicant);
    res.status(201).send();
  } else {
    res.status(500).send("invalid application type");
  }
});

exports.api = functions.https.onRequest(app);

