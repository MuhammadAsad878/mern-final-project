import mongoose from "mongoose";
import data from './data.js';
import {Listing} from "../models/listing.js";


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{ console.log("DB Connection Successfull!");}).catch((err)=>console.log("Error =",err));
async function  main() {
  await mongoose.connect(MONGO_URL);
}


const initDb = async ()=>{
  await Listing.deleteMany({});
  await Listing.insertMany(data.data);
  console.log("Old data deleted and new inserted successfully!");
}

initDb();
