import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-eco-gray rounded-lg m-2 p-2 flex justify-between items-center">
      <NavLink to="/" className="flex items-center">
        <img src="src/assets/production.png" alt="Logo" className="h-8 mr-3" />
        <span className="text-eco-green text-3xl font-Outfit-Regular">EcoSift</span>
      </NavLink>
      <div className="flex items-center space-x-4 font-Outfit-Medium tracking-wide text-lg">
        <NavLink to="/" activeclassname="text-white bg-eco-green" className="text-eco-green hover:text-white hover:bg-eco-green px-4 py-2 rounded-lg">Home</NavLink>
        <NavLink to="about-us" activeclassname="text-white bg-eco-green" className="text-eco-green hover:text-white hover:bg-eco-green px-4 py-2 rounded-lg">About Us</NavLink>
        <NavLink to="yolo-model" activeclassname="text-white bg-eco-green" className="text-eco-green hover:text-white hover:bg-eco-green px-4 py-2 rounded-lg">YOLO Model</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
