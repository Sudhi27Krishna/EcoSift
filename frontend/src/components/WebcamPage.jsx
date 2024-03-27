import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Updates from './Updates';
import OptionsTable from './OptionsTable';

const url = 'http://127.0.0.1:5000';

const WebcamPage = () => {
    const [requestStatus, setRequestStatus] = useState(false);
    const [clsList, setClsList] = useState({});
    const [optionsSelected, setOptionsSelected] = useState(false);

    const videoRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = io.connect(url);

        socket.current.on('update_frame', (data) => {
            const imageUrl = URL.createObjectURL(new Blob([data.frame], { type: 'image/jpeg' }));
            videoRef.current.src = imageUrl;

            const clsList = JSON.parse(data.cls);
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

    return (
        <div className='flex flex-row justify-between'>
            <div className="w-3/4 m-4 px-4 bg-gray-100 rounded-lg shadow-md h-[40rem]">
                {requestStatus ? (
                    <div className='w-full'>
                        <img ref={videoRef} width={1200} height={600} />
                    </div>) : (
                    <button
                        onClick={handleRequestFrames}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    >
                        Request Frames
                    </button>)
                }

            </div>
            {optionsSelected ? <Updates clsList={clsList} /> :
                <OptionsTable setClsList={setClsList} setOptionsSelected={setOptionsSelected} />
            }
        </div>
    );
};

export default WebcamPage;