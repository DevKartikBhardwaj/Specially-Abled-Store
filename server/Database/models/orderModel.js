import mongoose from 'mongoose';
const productSchema=new mongoose.Schema({
    product:String,
    qty:Number
})
const orderSchema=new mongoose.Schema({
    products:[productSchema],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    address:{
        type:String,
        require:true
    },
    bill:Number
},{timestamps:true})


const orders=mongoose.model('orders',orderSchema);
export default orders;