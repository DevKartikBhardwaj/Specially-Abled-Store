import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
    },
    qty:{
        type:Number,
        default:1
    }
},{timestamps:true})

const cart=mongoose.model('cart',cartSchema);
export default cart;