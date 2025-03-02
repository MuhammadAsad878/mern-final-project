import mongoose from "mongoose";

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
