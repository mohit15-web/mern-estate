import express from "express";
import { dbConnection } from './utils/database.js'
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/listing', listingRouter);
app.use(cors())

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  return res.status(status).json({
    success: false,
    status,
    message
  })
})

dbConnection()

app.listen(1234, () => {
  console.log("Listening on port");
});


