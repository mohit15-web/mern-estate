import express from "express";
import { dbConnection } from './utils/database.js'

const app = express();

dbConnection()

app.listen(1234, () => {
  console.log("Listening on port");
});


