import React from 'react'
import { NavLink } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className="bg-eco-gray rounded-lg flex items-center justify-center mx-2 px-4 h-[40rem]">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-6">EcoSift Waste Segregation System</h1>
                <div className="space-x-4">
                    <NavLink to="video-upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue">Video Upload</NavLink>
                    <NavLink to="webcam" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-green">Web Cam</NavLink>
                </div>
            </div>
        </div>
    )
}

export default HomePage