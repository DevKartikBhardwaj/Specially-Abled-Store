import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';
import '../styles/auth.css';
import { useGlobalContext } from '../Contexts/globalContext';
import { getAuthenticationOptions } from '../utilities/Helpers';
import { cleanAndFormatText, createSpeechToText } from '../utilities/createSpeechToText';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function Login() {
  const { baseAddress } = useGlobalContext();
  const [form, setForm] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
 const [recognizer, setRecognizer] = useState(null);
  const { speak, cancel } = useSpeechSynthesis();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });



  const navigate=useNavigate();
  const startListening1 = () => {
    setForm({ ...form, email: '' });
    const recognizerInstance = createSpeechToText(
      (result) => {
        setForm({ ...form, email: cleanAndFormatText(result) });
        cancel();
        speak({ text: result });
      },
    );
    setRecognizer(recognizerInstance);
    recognizerInstance?.start();

  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = await getAuthenticationOptions(baseAddress, form.email);
      if (!data.success) throw new Error(data.error);

      const optionsJSON = data.options;

      const asseResp = await startAuthentication({ optionsJSON });

      const verificationJSON = await axios.post(`${baseAddress}/verify-authentication`, { userEmail: form.email, asseResp });
      const verification = verificationJSON.data;
      if (!verification.success) throw new Error(verification.error);
        setForm({ email: '' });
      localStorage.setItem('authToken',verification.token);
      toast.success('Login Successfull');
      setLoading(false);
      navigate('/')
    } catch (error) {
      setForm({ email: '' });
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="meta-container">
      <form className="meta-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          onClick={startListening1}
          onMouseEnter={()=>{
            cancel();
            speak({text:"Enter your Email"});
          }}
          placeholder="you@example.com"
        />


        <button type="submit" onMouseEnter={()=>{
            cancel();
            speak({text:"Login"});
          }}>{loading?'loading...':'Log In'}</button>

        <div className="form-footer">
          <p onMouseEnter={()=>{
            cancel();
            speak({text:"Create new account: signup"});
          }}>
            Don’t have an account?<Link to='/signup'>Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
