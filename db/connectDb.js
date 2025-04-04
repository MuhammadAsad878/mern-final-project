import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_ATLAS_URL;

async function connectToDB() {
  try{
    await  mongoose.connect(MONGO_URL);
    console.log("Connection successfull with database");

  }catch(err){
    console.log("Error occured", err);
    return;
  }
}

export default connectToDB;
