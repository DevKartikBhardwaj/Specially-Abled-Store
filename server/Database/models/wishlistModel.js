import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
       product: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'products',
       },
       user: {
           type: mongoose.Schema.Types.ObjectId, 
           ref: 'users',
       }
},{timestamps:true});

const wishlist=mongoose.model('wishlists',wishlistSchema);

export default wishlist;