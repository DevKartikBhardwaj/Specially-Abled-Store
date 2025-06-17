import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { startRegistration } from '@simplewebauthn/browser';
import '../styles/auth.css';
// import loadingGif from "../assets/loading.gif";
import { useGlobalContext } from '../Contexts/globalContext';
import { generateOtp, requestRegistrationOptions, verifyAttResp, verifyEmail } from '../utilities/Helpers';
import { cleanAndFormatText, createSpeechToText } from '../utilities/createSpeechToText';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function Signup() {
  const { baseAddress } = useGlobalContext();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const { speak, cancel } = useSpeechSynthesis();
  const navigate=useNavigate();
  const startListening1 = () => {

    const recognizerInstance = createSpeechToText(
      (result) => {
        setForm({ ...form, name: result });
        cancel();
        speak({ text: result });
      },
    );
    setRecognizer(recognizerInstance);
    recognizerInstance?.start();

  };
  const startListening2 = () => {
    cancel();
    speak({ text: "Enter your email" });
    const recognizerInstance = createSpeechToText(
      (result) => {
        setForm({ ...form, email: cleanAndFormatText(result) });
        cancel();
        speak({ text: result });
      },
    );
    setRecognizer(recognizerInstance);
    recognizerInstance?.start();

    // setIsListening(true);
  };

  // const stopListening = () => {
  //   recognizer?.stop();
  // };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      const { userId } = await generateOtp(baseAddress, form);
      const inputOtp = parseInt(prompt('Verify Email'));

      const verified = await verifyEmail(baseAddress, userId, inputOtp);
      if (!verified) throw new Error("OTP not verified");

      const registrationOptions = await requestRegistrationOptions(baseAddress, userId);

      const attResp = await startRegistration({ optionsJSON: registrationOptions });

      const { data } = await verifyAttResp(baseAddress, userId, attResp);



      if (!data.success) throw new Error(data.error);


      toast.success('User registration successfull');
      setForm({ name: "", email: "" });
      setLoading(false);
      navigate('/login')
    } catch (error) {
      setForm({ name: "", email: "" });
      setLoading(false);
      toast.error(error.message);
    }
  };



  return (
    <div className="meta-container">
      <form className="meta-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          onClick={startListening1}
          onMouseEnter={() => {
            cancel();
            speak({ text: 'Enter your name' });
          }}
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          onClick={startListening2}
          onMouseEnter={() => {
            cancel();
            speak({ text: 'Enter your Email' });
          }}
        />


        <button type="submit" onMouseEnter={() => {
          cancel();
          speak({ text: 'Create Account' });
        }}><div>{loading ? 'loading...' : 'Create Account'}</div></button>

        <div className="form-footer">
          <p onMouseEnter={() => {
            cancel();
            speak({ text: 'go to login page' });
          }}>
            Already have an account? <Link to='/login'>Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
