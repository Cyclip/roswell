import express from "express";
import cors from "cors";
import "./loadenv.mjs";
import "./db/conn.mjs";

import authRouter from "./routes/authRoute.mjs";
import postRouter from "./routes/postRoute.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});