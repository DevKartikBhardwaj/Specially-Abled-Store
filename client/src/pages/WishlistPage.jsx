import React, { useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useGlobalContext } from '../Contexts/globalContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function WishlistPage() {
  const { baseAddress } = useGlobalContext();

  const { speak, cancel } = useSpeechSynthesis();

  const [wishlist, setWishlist] = useState();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userToken = localStorage.getItem('authToken');
        const { data } = await axios.post(`${baseAddress}/fetch-wishlist`, { userToken });
        if (!data.success) throw new error('Login to access cart!');
        setWishlist(data.wishlists);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchWishlist();
  }, [wishlist])



  


  async function addToCart(productId) {
    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) throw new Error('User is not loggedin!');
      const { data } = await axios.post(`${baseAddress}/add-to-cart`, { productId, userToken });
      if (data.error) throw new Error('User is not loggedin!');
      cancel();
      speak({ text: 'Product has been added to your cart.' });
      toast.success(`product added to cart successfully`);
    } catch (err) {
      cancel();
      speak({ text: 'Login to add product to the cart.' });
      toast.error(err.message);
      navigate('/login');
    }
  }
  

  const removeWishlist=async(wishlistId)=>{
    try {
      console.log(wishlistId);
      const userToken = localStorage.getItem("authToken");
      if (!userToken) throw new Error('User is not loggedin!');
      const {data}=await axios.post(`${baseAddress}/remove-wishlist`,{wishlistId,userToken});
      console.log(data)
    } catch (error) {
      cancel();
      speak('Unable to remove wishlist item.');
      toast.error('Unable to remove wishlist item.');
    }
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#000', color: '#ff9900', minHeight: '100vh' }}>
      <h2 style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '30px' }}>Your Wishlist</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {!wishlist? "loading...": wishlist.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#111',
              padding: '20px',
              border: '2px solid #ff4d4d',
              borderRadius: '10px',
              width: '280px',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={() =>
              speak({
                text: `${item.title}. ${item.description}. Price rupees ${item.mrp}`,
              })
            }
            onMouseLeave={cancel}
          >
            <h3 style={{ color: '#ff4d4d' }}>{item.title}</h3>
            <p style={{ color: '#ccc', fontSize: '14px' }}>{item.description}</p>
            <p style={{ color: '#ff9900', fontWeight: 'bold' }}>₹{item.mrp}</p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => addToCart(item.product)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#ff9900',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => speak({ text: 'Add to cart' })}
                onMouseLeave={cancel}
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeWishlist(item.wishlistId)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#ff4d4d',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => speak({ text: 'Remove from wishlist' })}
                onMouseLeave={cancel}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
