import { useEffect } from 'react';
import '../styles/home.css';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {  useSpeechSynthesis } from 'react-speech-kit';


const categories = [
  "Fruits & Vegetables", "Staples & Grains", "Spices & Masalas", "Oils & Ghee",
  "Snacks & Biscuits", "Packaged Foods", "Dairy & Bakery", "Beverages",
  "Personal Care", "Cleaning & Household", "Health & Wellness", "Miscellaneous"
];

export default function Home() {
  const { speak, cancel } = useSpeechSynthesis();

  return (
    <>
      <div className="home-container">
        {/* Carousel */}
        <div className="carousel">
          <div className="slides">
            <Link to='/'>
              <img src={banner1} alt='banner1' className="carousel-img" />
            </Link>
            <Link to='/'>
              <img src={banner2} alt='banner2' className="carousel-img" />
            </Link>
            <Link to='/'>
              <img src={banner3} alt='banner3' className="carousel-img" />
            </Link>
          </div>
        </div>

        {/* Category Boxes */}
        <h2 style={{ textAlign: 'center' }} aria-label='categories'>Categories</h2>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <Link to={`/products-page/?category=${encodeURIComponent(cat)}`} key={index} className="category-link" onMouseEnter={() => {  speak({ text: cat }) }} onMouseLeave={() => { cancel() }} aria-label={cat}>
              <div className="category-box">
                <h3>{cat}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
