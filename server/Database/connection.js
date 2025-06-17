import mongoose from "mongoose";


export async function connection(uri){
    try {
        await mongoose.connect(uri);
        console.log("Database connected");
    } catch (error) {
        console.log(error.message);
    }
}