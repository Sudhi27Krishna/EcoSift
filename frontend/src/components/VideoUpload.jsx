import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Updates from './Updates';
import OptionsTable from './OptionsTable';

const url = 'http://127.0.0.1:5000';

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
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
    socket.current.emit('request_frames_video', 'uploads\\uploaded-video.mp4');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const videoObjectUrl = URL.createObjectURL(file);
      setVideoUrl(videoObjectUrl);
    }
  };


  const handleUpload = async () => {
    try {
      const file = await fetch(videoUrl).then((res) => res.blob());
      const formData = new FormData();
      formData.append('file', file, 'uploaded-video.mp4');

      const response = await fetch(url.concat('/upload_video'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Video uploaded successfully!');
        setIsUploaded(true);
        alert('Video uploaded successfully!');
      } else {
        setUploadStatus('Failed to upload video.');
      }
    } catch (error) {
      document.getElementById("upload-video-label").style.display = "none";
      alert('Error uploading video:');
      console.error('Error uploading video:', error);
      setUploadStatus('An error occurred during upload.');
    }
  };

  return (
    <div className='flex flex-row justify-between'>
      <div className={isUploaded ? "w-3/4 flex flex-col justify-center mx-2 px-4 border-solid rounded-lg shadow-md h-[40rem]" : "w-3/4 flex justify-center items-center mx-2 px-4 border-solid rounded-lg shadow-md h-[40rem]"}>
        {isUploaded && (
          <div className="m-2">
            <div className="flex flex-row">
              <p className="text-lg font-semibold mb-2">Video Uploaded:</p>
              <button
                className='bg-blue-500 text-white mx-4 mb-2 py-1 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800'
                onClick={handleRequestFrames}
              >
                Request Frames
              </button>
            </div>
            <div className='w-full'>
              <img ref={videoRef} width={1200} height={500} />
            </div>
          </div>
        )}
        {!isUploaded && (
          <div className='shadow-inner bg-white flex flex-col justify-center items-center p-2 rounded-lg border-dashed border-2 border-gray-400 w-[70%] h-[60%]'>
            <label id="upload-video-label" className="block text-xl mb-6 font-Outfit-Medium">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="border rounded p-2 ml-2 font-Outfit-Light"
              hidden={isUploaded}
            />
            <button
              onClick={handleUpload}
              className="flex items-center mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              <p className='mr-2 font-Outfit-Regular'>Upload</p>
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0" />
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                <g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="#ffffff" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.25C12.2106 2.25 12.4114 2.33852 12.5535 2.49392L16.5535 6.86892C16.833 7.17462 16.8118 7.64902 16.5061 7.92852C16.2004 8.20802 15.726 8.18678 15.4465 7.88108L12.75 4.9318V16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16V4.9318L8.55353 7.88108C8.27403 8.18678 7.79963 8.20802 7.49393 7.92852C7.18823 7.64902 7.16698 7.17462 7.44648 6.86892L11.4465 2.49392C11.5886 2.33852 11.7894 2.25 12 2.25Z" fill="#ffffff" /> </g>
              </svg>
            </button>
          </div>
        )}
        {/* {uploadStatus && <p className="m-2">{uploadStatus}</p>} */}
      </div>
      {optionsSelected ? <Updates clsList={clsList} coordList={coordList} /> :
        <OptionsTable setClsList={setClsList} setOptionsSelected={setOptionsSelected} />
      }
    </div>
  );
};

export default VideoUpload;