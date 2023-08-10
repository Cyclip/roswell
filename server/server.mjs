import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import "./loadenv.mjs";
import "./db/conn.mjs";

import authRouter from "./routes/authRoute.mjs";
import postRouter from "./routes/postRoute.mjs";
import commentRouter from "./routes/commentRoute.mjs";
import replyRouter from "./routes/replyRoute.mjs";
import feedRouter from "./routes/feedRoute.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static files
app.use(express.static("public"));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/reply", replyRouter);
app.use("/feed", feedRouter);

// Catch-all route to serve the React app's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
