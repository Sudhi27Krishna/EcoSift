import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Updates from './Updates';
import OptionsTable from './OptionsTable';

const url = 'http://127.0.0.1:5000';

const WebcamPage = () => {
    const [requestStatus, setRequestStatus] = useState(false);
    const [clsList, setClsList] = useState({});
    const [coordList, setCoordList] = useState({});
    const [optionsSelected, setOptionsSelected] = useState(false);

    const videoRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io.connect(url);

        socket.current.on('update_frame', (data) => {
            const imageUrl = URL.createObjectURL(new Blob([data.frame], { type: 'image/jpeg' }));
            videoRef.current.src = imageUrl;

            const clsList = JSON.parse(data.cls);
            const coordList = JSON.parse(data.coord);
            setCoordList(coordList);
            console.log(clsList);
            setClsList(clsList);
        });

        socket.current.on('connect', () => {
            console.log('Connected to server');
        });

        socket.current.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    const handleRequestFrames = () => {
        setRequestStatus(true);
        socket.current.emit('request_frames_webcam');
    };

    const handleStopFrames = async () => {
        try {
            const response = await fetch(url.concat('/stop_webcam_tracking'));
            console.log(response.data);
            setRequestStatus(false);
        } catch (error) {
            console.log("Frame stop error", error);
        }
    };

    const handleSegregation = async () => {
        const delta_coords = [];
        Object.keys(coordList).forEach(key => {
            delta_coords.push(new Array(coordList[key][0], coordList[key][1]));
        });
        try {
            await fetch(url.concat('/segregate'), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ delta_coords })
            })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-row justify-between'>
            <div className="w-3/4 mx-2 px-4 rounded-lg shadow-2xl h-[40rem]">
                <div className='h-full flex items-center justify-between'>
                    {requestStatus ? (
                        <img ref={videoRef} width={800} />
                    ) : (
                        <div className='border-gray-300 border shadow-inner bg-white bg-opacity-50 rounded-lg  w-[800px] h-full flex items-center justify-center place-content-center'>
                            <button
                                onClick={handleRequestFrames}
                                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            >
                                <p className='mr-2 font-Outfit-Regular'>Request Frames</p>
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                    <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="13" r="3" stroke="#ffffff" stroke-width="1.5" /> <path d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" /> <path d="M19 10H18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" /> </g>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className={requestStatus ? "w-1/4 h-full flex flex-col items-center justify-center" : "w-1/4 h-full flex flex-col items-center justify-center pointer-events-none opacity-50"}>
                        <button
                            onClick={handleStopFrames}
                            className="bg-red-500 text-white my-2 py-2 px-6 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red active:bg-red-800"
                        >
                            Stop Detection
                        </button>
                        <button
                            onClick={handleSegregation}
                            className="bg-green-500 text-white my-2 py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
                        >
                            Start Segregation
                        </button>
                    </div>
                </div>

            </div>
            {optionsSelected ? <Updates clsList={clsList} coordList={coordList} /> :
                <OptionsTable setClsList={setClsList} setOptionsSelected={setOptionsSelected} />
            }
        </div>
    );
};

export default WebcamPage;