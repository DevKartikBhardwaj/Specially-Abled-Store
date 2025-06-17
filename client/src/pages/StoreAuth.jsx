import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/StoreAuth.css';
import { useGlobalContext } from '../Contexts/globalContext';

export default function StoreAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const { baseAddress } = useGlobalContext();
  const [form, setForm] = useState({
    storeName: '',
    storeEmail: '',
    storePassword: '',
    geolocation: ''
  });


  const findGeoLocation = () => {

    navigator.geolocation.getCurrentPosition((position) => {
      const positionString = position.coords.longitude.toString() + ',' + position.coords.latitude.toString();

      setForm({ ...form, geolocation: positionString });

    }, (error) => {
      toast.error(error.message);
    })

  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { storeEmail, storePassword } = form;
      var { data } = await axios.post(`${baseAddress}/authenticate-store`, { storeEmail, storePassword });
      setForm({
        storeName: '',
        storeEmail: '',
        storePassword: '',
        geolocation: ''
      })
      if (!data.success)
        toast.error('Store authentication unsuccessfull!');
      else {
        toast.success('Store authenicated!');
        localStorage.setItem('store-authToken', data.token);
      }
    } else {
      var { data } = await axios.post(`${baseAddress}/register-store`, form);
      setForm({
        storeName: '',
        storeEmail: '',
        storePassword: '',
        geolocation: ''
      })
      if (!data.success) toast.error('Store registraion unsuccessfull!');
      else toast.success('Store registered!');
    }
  };

  return (
    <div className="store-auth-container">
      <form className="store-auth-form" onSubmit={handleSubmit}>
        <h1>{isLogin ? 'Store Login' : 'Store Registration'}</h1>

        {!isLogin && (
          <>
            <label htmlFor="storeName">Store Name</label>
            <input
              type='text'
              id="storeName"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              required
              placeholder="Your Store Name"
            />

            <label htmlFor="geolocation">Store Geolocation</label>
            <input
              type="text"
              id="geolocation"
              name="geolocation"
              value={form.geolocation}
              onClick={findGeoLocation}
              required
              placeholder="123.456, 78.910"
            />
          </>
        )}

        <label htmlFor="storeEmail">Store Email</label>
        <input
          type="email"
          id="storeEmail"
          name="storeEmail"
          value={form.storeEmail}
          onChange={handleChange}
          required
          placeholder="store@example.com"
        />

        <label htmlFor="storePassword">Password</label>
        <input
          type="password"
          id="storePassword"
          name="storePassword"
          value={form.storePassword}
          onChange={handleChange}
          required
          placeholder="Enter password"
        />

        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>

        <div className="form-footer">
          <p>
            {isLogin ? (
              <>
                Don't have a store account?{' '}
                <button type="button" onClick={() => setIsLogin(false)}>
                  Register
                </button>
              </>
            ) : (
              <>
                Already have a store account?{' '}
                <button type="button" onClick={() => setIsLogin(true)}>
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
