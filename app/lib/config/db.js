import mongoose, { connect } from "mongoose";

export const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://thuvakannan76:qYGqEN5TIPGvuLCR@cluster0.ksai7ze.mongodb.net/todo-app"
  );
  console.log("DB Connected");
};
