import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });

const app = express();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
