const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');

const db = admin.firestore();

const app = express();