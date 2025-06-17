import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './Database/connection.js';
import { generateAndSaveOtp, generateRegistrationOptionsHelper, verifyAttRespHelper } from './utilities/RegistrationHelpers.js';
import { userCollection } from './Database/models/userModel.js';
import { generateAuthenticationOptionsHelper, generateToken, verifyAuthenticationHelper } from './utilities/AuthenticationHelpers.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import storeCollection from './Database/models/storeModel.js';
import products from './Database/models/productModel.js';
import { protectedRoute } from './Middlewares/protectedRoute.js';
import cart from './Database/models/cartModel.js';
import orders from './Database/models/orderModel.js';
import wishlist from './Database/models/wishlistModel.js';
const app = express();

dotenv.config();


//middlewares
app.use(express.json());
app.use(cors());
//global constants
const PORT = process.env.PORT || 3000;
const DBURI = process.env.DBURI || 3000;
const secret = process.env.SECRET;

//database connection here
connection(DBURI);


app.post('/generate-otp', async (req, res) => {
    try {
        const { name, email } = req.body;
        const otpResp = await generateAndSaveOtp({ name, email });
        res.json({ success: true, userId: otpResp });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})
app.post('/verify-email', async (req, res) => {
    try {
        const { userId, inputOtp } = req.body;
        const { otp } = await userCollection.findOne({ _id: userId });

        if (otp != inputOtp) throw new Error("");
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
})

app.post('/generate-registration-options', async (req, res) => {
    try {
        const { body } = req;
        const registrationOptions = await generateRegistrationOptionsHelper(body);
        res.json({ success: true, registrationOptions });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})

app.post('/verify-attResp', async (req, res) => {
    try {
        const { userId, attResp } = req.body;
        const verified = await verifyAttRespHelper(userId, attResp);
        if (!verified) throw new Error('Registration response not verified');
        else await userCollection.findByIdAndUpdate(userId, { registered: true });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})



//login related endpoints
app.post('/generate-authentication-options', async (req, res) => {
    try {
        const { body } = req;
        const options = await generateAuthenticationOptionsHelper(body);

        res.json({ success: true, options });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})


app.post('/verify-authentication', async (req, res) => {
    try {
        const { verified } = await verifyAuthenticationHelper(req.body);
        if (!verified) throw new Error('Authentication not verified');
        const { _id } = await userCollection.findOne({ userEmail: req.body.userEmail });
        const token = generateToken({ _id }, secret);

        res.json({ success: true, token });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})



//products related
app.get('/fetch-products', async (req, res) => {
    try {
        // const productsArray=await products.find({});
        const category = req.query.category;
        const filter = category ? { category } : {}; // optional filter
        const productsArray = await products.find(filter);
        res.json({ success: true, products: productsArray });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})


app.post('/add-to-cart', protectedRoute, async (req, res) => {
    try {
        const { productId, user } = req.body;
        const cartItemExist=await cart.findOne({product:productId});
        if(cartItemExist) await cart.findByIdAndUpdate(cartItemExist._id,{qty:cartItemExist.qty+1});
        else{
            const obj = { product: productId, user };
            await cart.insertOne(obj);
        }
        res.json({ success: true, user: req.user });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})


app.post('/fetch-cart', protectedRoute, async (req, res) => {
    try {
        const { user } = req.body;
        const cartArray = await cart.find({ user });

        const cartItems = await Promise.all(
            cartArray.map(async (cartItem) => {
                const productData = await products.findOne({ _id: cartItem.product });

                if (!productData) return null; // optional: handle missing product

                const { title, description, mrp } = productData;
                return {
                    _id:cartItem._id,
                    title,
                    description,
                    price: mrp,
                    qty: cartItem.qty
                };
            })
        );

        // Filter out any nulls (if a product was not found)
        const filteredCartItems = cartItems.filter(item => item !== null);

        res.json({ success: true, cartItems: filteredCartItems });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})


app.post('/manipulate-cart-qty',async(req,res)=>{
    try {
        const {_id,prevQty,value}=req.body;
        await cart.findByIdAndUpdate(_id,{qty:prevQty+value});
        if (prevQty == 1&&value<0) await cart.findByIdAndDelete(_id);
        res.json({success:true});
    } catch (error) {
        res.json({success:false});
    }
})

app.post('/push-order',protectedRoute,async(req,res)=>{
    try {
        await orders.insertOne(req.body);
        res.json({success:true,user:req.body.user});
    } catch (error) {
        res.json({success:false});
    }
})

app.post('/clear-cart',async(req,res)=>{
    await cart.deleteMany({user:req.body.user});
    res.json({success:true});
})


app.post('/add-to-wishlist',protectedRoute,async(req,res)=>{
    try {
        const {productId,user}=req.body;
        const wishListExist=await wishlist.findOne({product:productId,user});
        if(!wishListExist)await wishlist.insertOne({product:productId,user});
        res.json({success:true,data:req.body});
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})
app.post('/fetch-wishlist',protectedRoute,async(req,res)=>{
   try {
        const { user } = req.body;
        const result=[];
        const wishlists=await wishlist.find({user});
        
        for(let item of wishlists){
            const {title,description,mrp}=await products.findOne({_id:item.product});
            result.push({title,description,mrp,product:item.product,wishlistId:item._id});
        }
        res.json({success:true,wishlists:result});
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
})
app.post('/remove-wishlist',protectedRoute,async(req,res)=>{
    try {
        const {wishlistId}=req.body;
      
        const resp=await wishlist.deleteOne({_id:wishlistId});
        console.log(resp)
        res.json({success:true});
    } catch (error) {
        res.json({success:false});
    }
})


app.post('/fetch-user',protectedRoute,async(req,res)=>{
    try {
        const {user}=req.body;
        const {userName,userEmail}=await userCollection.findById(user);
        res.json({success:true,name:userName,email:userEmail});
    } catch (error) {
        res.json({success:false});
    }
})

app.listen(PORT, () => console.log(`server is running at ${PORT}`));