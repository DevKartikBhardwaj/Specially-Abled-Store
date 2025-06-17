import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    imageDescription:String,
    title:String,
    description:String,
    mrp:Number,
    category:String
})


const products=mongoose.model("products",productSchema);

export default products;