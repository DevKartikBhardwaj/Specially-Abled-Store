import mongoose from "mongoose";

const storeSchema=new mongoose.Schema({
    storeName:{
        type:String,
        required:true
    },
    storeEmail:{
        type:String,
        required:true,
        unique:true
    },
    storePassword:{
        type:String,
        required:true
    },
    geolocation:{
        type:String,
        required:true
    }
})

const storeCollection=mongoose.model('Stores',storeSchema);
export default storeCollection;