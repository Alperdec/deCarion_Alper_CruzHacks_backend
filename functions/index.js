const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const { initializeApp } = require("firebase-admin");
const { firebaseConfig } = require("firebase-functions");

admin.initializeApp({credential: admin.credential.applicationDefault()})
const db = admin.firestore();
const app = express();

app.get('/', (req, res) => {
    res.send('hello world')
    console.log('wowowow')
})

app.listen(3000)