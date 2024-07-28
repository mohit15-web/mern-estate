import express from "express";
import { dbConnection } from './utils/database.js'
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
// app.use(cors())

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


