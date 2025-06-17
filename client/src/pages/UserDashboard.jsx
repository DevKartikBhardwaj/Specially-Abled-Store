import React, { useEffect ,useState} from 'react';
import '../styles/UserDashboard.css';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../Contexts/globalContext';


// Dummy user data (replace with actual context or API response)
// const currentUser = {
//   name: 'Xyz',
//   email: 'xyz@example.com',
// };

const UserDashboard = () => {
  const {baseAddress}=useGlobalContext();
  const navigate=useNavigate();
  const [currentUser,setCurrentUser]=useState({ name: 'Xyz', email: 'xyz@example.com'})
  const { speak, cancel } = useSpeechSynthesis();

  const handleSpeak = (text) => speak({ text });
  const handleStop = () => cancel();

  const dashboardItems = [
//     { title: 'My Profile', description: 'View and edit your profile information.', link: '/profile' },
//     { title: 'My Orders', description: 'View your order history and track orders.', link: '/orders' },
    { title: 'Wishlist', description: 'Access and manage your wishlist.', link: '/wishlist' },
    { title: 'Cart', description: 'Go to your shopping cart.', link: '/cart' },
//     { title: 'Logout', description: 'Sign out of your account.', link: '/logout' },
  ];



  useEffect(()=>{
    const fetchUser=async()=>{
      try {
        const userToken = localStorage.getItem("authToken");
        if (!userToken) throw new Error('User is not loggedin!');
        const {data}=await axios.post(`${baseAddress}/fetch-user`,{userToken});
        setCurrentUser({name:data.name,email:data.email});
        if(!data.success)throw new Error('');
      } catch (error) {
        navigate('/login');
      }
    }
    fetchUser();
  },[])

  return (
    <div className="user-dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
      <div className="user-info"
        onMouseEnter={() => handleSpeak(`User name ${currentUser.name}, email ${currentUser.email}`)}
        onMouseLeave={handleStop}
      >
        <h2>{currentUser.name}</h2>
        <p>{currentUser.email}</p>
      </div>


      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="dashboard-card"
            onMouseEnter={() => handleSpeak(`${item.title}. ${item.description}`)}
            onMouseLeave={handleStop}
          >
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </a>
        ))} 
      </div>
    </div>
  );
};

export default UserDashboard;
