
import { useState } from 'react';
import '../styles/ProductPage.css';
import SpeakOnHover from './SpeakOnHover.jsx';
import { useEffect } from 'react';
import { useGlobalContext } from '../Contexts/globalContext.jsx';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSpeechSynthesis } from 'react-speech-kit';


export default function ProductPage() {
  const navigate=useNavigate();
  const { speak, cancel } = useSpeechSynthesis();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const [products, setProducts] = useState();
  const { baseAddress } = useGlobalContext();
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(`${baseAddress}/fetch-products/?category=${encodeURIComponent(category)}`);
      setProducts(data.products);
    }
    fetchProducts();
  }, [])

  async function addToCart(productId) {
    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) throw new Error('User is not loggedin!');
      const { data } = await axios.post(`${baseAddress}/add-to-cart`, { productId, userToken });
      if(data.error)throw new Error('User is not loggedin!');
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


  async function addToWishlist(productId){
    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) throw new Error('User is not loggedin!');
      const { data } = await axios.post(`${baseAddress}/add-to-wishlist`, { productId, userToken });
      console.log(data);
      if(data.error)throw new Error('User is not loggedin!');
      cancel();
      speak({ text: 'Product has been added to your wishlist.' });
      toast.success(`product added to wishlist successfully`);
    } catch (err) {
      cancel();
      speak({ text: 'Login to add product to the wishlist.' });
      toast.error(err.message);
      navigate('/login');
    }
  }


  return (
    <div className="product-page">
      <h1 className="page-title">Our Products</h1>
      <div className="product-flex-container">
        {!products ? "Loading..." : products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <SpeakOnHover
              text={`${product.title}. ${product.description}. Price ₹${product.mrp}. Image: ${product.imageDescription}`}
            >
              <div className="product-card">
                <div className="image-placeholder">{product.imageDescription}</div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p className="price">Price: ₹{product.mrp}</p>
                <p className="price">category: ₹{product.category}</p>
                <div className="card-buttons">
                  <SpeakOnHover text="Add to cart">
                    <button onClick={() => addToCart(product._id)}>Add to Cart</button>
                  </SpeakOnHover>
                  <SpeakOnHover text="Add to wishlist">
                    <button onClick={() => addToWishlist(product._id)}>Add to Wishlist</button>
                  </SpeakOnHover>
                  {/* <SpeakOnHover text="Buy now">
                    <button>Buy Now</button>
                  </SpeakOnHover> */}
                </div>
              </div>
            </SpeakOnHover>
          </div>
        ))}
      </div>
    </div>
  );
}
