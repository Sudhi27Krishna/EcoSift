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
          <div className='bg-white flex flex-col justify-center items-center p-2 rounded-lg border-dashed border-2 border-black w-[70%] h-[60%]'>
            <label id="upload-video-label" className="block text-lg font-semibold mb-2">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="border rounded p-2 ml-2"
              hidden={isUploaded}
            />
            <button
              onClick={handleUpload}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Upload Video
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