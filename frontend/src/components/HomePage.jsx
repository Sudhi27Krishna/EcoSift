import React from 'react'
import { NavLink } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className="flex items-center justify-center mx-2 px-4 h-[40rem]">
            <div>
                <p className='text-end font-Outfit-SemiBold text-5xl tracking-wide mb-2'>EcoSift</p>
                <p className='text-end font-Outfit-Light text-xl text-eco-green'> Segregating Waste Made Smarter                </p>
            </div>
            <div class="border-l-2 h-36 border-gray-400 mx-40"></div>
            <div className='w-[50vh]'>
                <p className='text-justify font-Outfit-Regular mb-5 text-lg'>"Efficiently segregate waste with our advanced software, utilizing YOLO object detection and delta arm manipulation for precise sorting." </p>
                <div className='flex justify-evenly font-Outfit-Light text-lg mt-10'>
                    <NavLink to="video-upload" className="text-eco-green hover:text-eco-gray border border-eco-green hover:bg-eco-green hover:bg-opacity-50 py-3 px-5 rounded-full focus:outline-none focus:shadow-outline-blue">Video Upload</NavLink>
                    <NavLink to="webcam" className="text-eco-gray bg-eco-green border border-eco-green hover:bg-opacity-50 py-3 px-5 rounded-full focus:outline-none focus:shadow-outline-green">Web Cam</NavLink>
                </div>
            </div>
        </div>
    )
}

export default HomePage


// import React from 'react'
// import { NavLink } from 'react-router-dom'

// const HomePage = () => {
//     return (
//         <div className="rounded-lg flex items-center justify-center mx-2 px-4 h-[40rem]">
//             <div className="text-center">
//                 <h1 className="text-4xl font-bold text-green-600 mb-6">EcoSift Waste Segregation System</h1>
//                 <div className="space-x-4">
//                     <NavLink to="video-upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue">Video Upload</NavLink>
//                     <NavLink to="webcam" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-green">Web Cam</NavLink>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HomePage