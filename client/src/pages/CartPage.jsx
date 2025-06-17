import React, { useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import '../styles/CartPage.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import axios from 'axios';
import { useGlobalContext } from '../Contexts/globalContext';
import { getUserAddress } from '../utilities/getUserAddress';
const address='Roorkee-Haridwar Road (NH-58), Vardhmanpuram, Roorkee - 247667, Uttarakhand, India';

export default function CartPage() {

  const { baseAddress } = useGlobalContext();

  const { speak, cancel } = useSpeechSynthesis();
  const [cart, setCart] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userToken = localStorage.getItem('authToken');
        const { data } = await axios.post(`${baseAddress}/fetch-cart`, { userToken });
        if (!data.success) throw new error('Login to access cart!');
        setCart(data.cartItems);
      } catch (error) {
        console.log(error.message);
      }
    }
    cart&&setTotalAmount(cart.reduce((acc, item) => acc + item.price * item.qty, 0));

    fetchCart();

  }, [cart])


  const handleCheckout=async()=>{
    try {
     
      let products=[];
      const userToken=localStorage.getItem('authToken');
      if(!cart[0]||!userToken)throw new Error();
      cart.map((cartItem)=>{
       const {title,description,price,qty}=cartItem;
        products.push({product:JSON.stringify({title,description,price}),qty});
      })
      const addr=await getUserAddress();
      
      const orderObj={products, address,bill:totalAmount,userToken};
      const {data}=await axios.post(`${baseAddress}/push-order`,orderObj);
    
      if(!data.success)throw new Error();
      await axios.post(`${baseAddress}/clear-cart`,{user:data.user});
      cancel();
      speak({text:"Order placed."});
      toast.success("order placed.")
    } catch (error) {
      cancel();
      speak({text:"Order not placed."});
      toast.error("order not placed.")
    }
  }

  const handleMouseEnter = (text) => {
    speak({ text });
  };

  const handleMouseLeave = () => {
    cancel();
  };

  const increaseQty = async (_id, prevQty) => {
    try {
      cancel();
      speak({ text: 'increment quantity' });
      await axios.post(`${baseAddress}/manipulate-cart-qty`, { _id, prevQty, value: 1 });
    } catch (error) {
      console.log(error);
    }

  };

  const decreaseQty = async (_id, prevQty) => {
    try {
      cancel();
      speak({ text: 'decrement quantity' });
      await axios.post(`${baseAddress}/manipulate-cart-qty`, { _id, prevQty, value: -1 });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-items">
        {!cart ? "loading..." : cart.map((item) => (
          <div
            className="cart-card"
            key={item._id}
            onMouseEnter={() =>
              handleMouseEnter(
                `${item.title}. ${item.description}. Price ₹${item.price}. Quantity ${item.qty}`
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <div className="cart-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="price">Price: ₹{item.price}</p>
              <div className="quantity-controls">
                <button onClick={() => decreaseQty(item._id, item.qty)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item._id, item.qty)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: ₹{totalAmount}</h2>
        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
}
