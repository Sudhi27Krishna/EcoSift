import React from 'react'

const About = () => {
    return (
        <div className='rounded-lg flex flex-row justify-between mx-2 px-4 h-[40rem]'>
            <div className='w-2/5 text-justify flex justify-center items-center'>
                <p className='font-Outfit-SemiBold text-5xl text-eco-green'>About Us</p>
            </div>
            <div className='w-3/5 text-justify flex flex-col justify-center text-eco-green pr-5'>
                <p className='font-Outfit-Regular text-lg mb-5'> Welcome to EcoSift! We are a dynamic team of students from MITS passionate about solving socially relevant problems.</p>
                <p className='font-Outfit-Medium text-3xl'> Our Mission</p>
                <p className='font-Outfit-Regular text-lg mb-5'> At EcoSift, we strive to make a positive impact through innovation and collaboration. Our mission is to promote sustainable development.</p>
                <p className='font-Outfit-Medium text-3xl'> Who We Are</p>
                <p className='font-Outfit-Regular text-lg mb-2'> Meet the creative minds behind EcoSift. Our diverse team is committed to excellence, embracing innovation, and fostering collaboration.</p>
                <div className='flex justify-between mb-5 px-2'> {/* contributors */}
                    <div className='flex'>
                        <img src='src/assets/ali.jpeg' className='h-11 rounded-full mr-3' />
                        <div >
                            <p className='font-Outfit-Regular'>Alimon N A</p>
                            <div className='flex items-center'>
                                <img src='src/assets/linkedin.png' className='h-4 mr-1 opacity-50' />
                                <a href='https://www.linkedin.com/in/alimon-n-a-62b033205/' className='text-xs'>alimon-n-a</a>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <img src='src/assets/arjun.jpeg' className='h-11 rounded-full mr-3' />
                        <div >
                            <p className='font-Outfit-Regular'>Arjun P Unni</p>
                            <div className='flex items-center'>
                                <img src='src/assets/linkedin.png' className='h-4 mr-1 opacity-50' />
                                <a href='https://www.linkedin.com/in/arjun-p-unni-/' className='text-xs'>arjun-p-unni-</a>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <img src='src/assets/gowri.jpeg' className='h-11 rounded-full mr-3' />
                        <div >
                            <p className='font-Outfit-Regular'>Gowri M</p>
                            <div className='flex items-center'>
                                <img src='src/assets/linkedin.png' className='h-4 mr-1 opacity-50' />
                                <a href='https://www.linkedin.com/in/gowri-m-7b54b9211/' className='text-xs'>gowri-m</a>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        <img src='src/assets/sudhi.jpeg' className='h-11 rounded-full mr-3' />
                        <div >
                            <p className='font-Outfit-Regular'>Sudhi Krishna N A</p>
                            <div className='flex items-center'>
                                <img src='src/assets/linkedin.png' className='h-4 mr-1 opacity-50' />
                                <a href='https://www.linkedin.com/in/sudhi27krishna/' className='text-xs'>sudhi27krishna</a>
                            </div>
                        </div>
                    </div >
                </div>
                <p className='font-Outfit-Medium text-3xl'> What Sets Us Apart</p>
                <p className='font-Outfit-Regular text-lg mb-5'> Discover EcoSift's unique features, from cutting-edge approaches to a dedication to social impact. Join us on this exciting journey!</p>
                <p className='self-end font-Outfit-Light'> Follow us on social media and be part of our community.</p>
                <p className='self-end font-Outfit-Light'> Thank you for your support!</p>
                <a href='https://github.com/Sudhi27Krishna/EcoSift' className='self-end font-Outfit-Regular'> EcoSift Team</a>
            </div >
        </div >
    )
}
export default About
