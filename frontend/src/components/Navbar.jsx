import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-200 rounded-lg m-2 p-2 flex justify-between items-center">
      <div className="flex items-center">
        <img src="https://bizweb.dktcdn.net/100/438/408/files/gigachad-meme-yodyvn.jpg?v=1696388231581" alt="Logo" className="h-12 mr-2 scale-x-[-1] rounded" />
        <span className="text-green-600 text-lg font-bold">EcoChad</span>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/" className="text-green-600 font-bold hover:text-white hover:bg-green-800 px-4 py-2 rounded-lg">Home</a>
        <a href="#about" className="text-green-600 font-bold hover:text-white hover:bg-green-800 px-4 py-2 rounded-lg">About Us</a>
        <a href="#yolo" className="text-green-600 font-bold hover:text-white hover:bg-green-800 px-4 py-2 rounded-lg">YOLO Model</a>
      </div>
    </nav>
  );
};

export default Navbar;
