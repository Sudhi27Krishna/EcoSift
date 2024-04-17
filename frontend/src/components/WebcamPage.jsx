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
                        <div className='border-2 rounded-lg border-black w-[800px] h-full flex items-center justify-center place-content-center'>
                            <button
                                onClick={handleRequestFrames}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            >
                                Request Frames
                            </button>
                        </div>
                    )}
                    <div className={requestStatus ? "w-1/4 h-full flex flex-col items-center justify-center" : "w-1/4 h-full flex flex-col items-center justify-center pointer-events-none"}>
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