import React, { useState, useEffect } from 'react'
import JSZip from 'jszip';

const allowedFilenames = ['results.png', 'confusion_matrix.png', 'confusion_matrix_normalized.png', 'R_curve.png', 'PR_curve.png', 'F1_curve.png', 'P_curve.png', 'labels.jpg', 'labels_correlogram.jpg'];

const YoloModel = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedImages = localStorage.getItem('uploadedImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }

    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Remove event listener on cleanup
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    // Remove uploadedImages from sessionStorage when the tab is closed
    localStorage.removeItem('uploadedImages');
  };

  const handleFolderUpload = (event) => {
    const folder = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const folderData = e.target.result;

      JSZip.loadAsync(folderData).then((zip) => {
        const imagePromises = [];

        zip.forEach((relativePath, file) => {
          // Check if the file's filename is included in the allowedFilenames array
          if (!file.dir && allowedFilenames.includes(file.name.slice(6))) {
            const promise = file.async('base64').then((data) => {
              return `data:${file.type};base64,${data}`;
            });
            imagePromises.push(promise);
          }
        });

        Promise.all(imagePromises).then((images) => {
          setImages(images);
          localStorage.setItem('uploadedImages', JSON.stringify(images)); // Store images in localStorage
        });
      });
    };

    reader.readAsArrayBuffer(folder);
  };

  return (
    <div className="rounded-lg flex flex-col justify-between mx-2 px-4 h-[40rem]">
      <div className='w-full bg-green-100 self-start mr-4 mt-4 pl-3 rounded-lg'>
        <label id="upload-yolo-model-label" className="block text-lg font-Outfit-Medium m-2">Upload Yolo Model Folder</label>
        <input
          type="file"
          accept=".zip" // Allow users to upload only zip files
          onChange={handleFolderUpload}
          className=" ml-2 mb-4"
        />
      </div>
      <div className=" bg-white rounded-lg grid grid-cols-5 gap-2 mb-4 ">
        {images.map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img src={image} alt={`Image ${index}`} width={250} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default YoloModel