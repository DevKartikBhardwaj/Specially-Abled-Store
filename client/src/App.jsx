import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import StoreAuth from './pages/StoreAuth';
import StoreDashboard from './pages/StoreDashboard';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import UserDashboard from './pages/UserDashboard';
import WishlistPage from './pages/WishlistPage';
const App = () => {


  return (
    <Router>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products-page" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/dashboard" element={<UserDashboard/>} />
        <Route path="/wishlist" element={<WishlistPage/>} />

      </Routes>

    </Router>
  )
}

export default App