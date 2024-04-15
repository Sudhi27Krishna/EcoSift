import React from 'react'

const HomePage = () => {
    return (
        <div className="bg-eco-gray rounded-lg flex items-center justify-center h-[88vh]">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-6">EcoSift Waste Segregation System</h1>
                <div className="space-x-4">
                    <a href="/video-upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue">Video Upload</a>
                    <a href="/webcam" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-green">Web Cam</a>
                </div>
            </div>
        </div>
    )
}

export default HomePage