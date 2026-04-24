import mongoose from "mongoose";
import {config} from "./config.js"
const connectDB =async ()=>{
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("mongoDb connected")
    }catch(error){
        console.log("error in mongoDb : ",error);
    }
}

export default connectDB