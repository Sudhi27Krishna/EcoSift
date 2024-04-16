import React, { useState } from 'react'
import JSZip from 'jszip';

const YoloModel = () => {
  const [images, setImages] = useState([]);

  const handleFolderUpload = (event) => {
    const folder = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const folderData = e.target.result;

      JSZip.loadAsync(folderData).then((zip) => {
        const imagePromises = [];

        const filenamesToInclude = ['results.png', 'confusion_matrix.png', 'confusion_matrix_normalized.png', 'R_curve.png', 'PR_curve.png', 'F1_curve.png', 'P_curve.png', 'labels.jpg', 'labels_correlogram.jpg'];

        zip.forEach((relativePath, file) => {
          console.log(file.name);
          if (!file.dir && filenamesToInclude.includes(file.name.slice(6))) {
            const promise = file.async('base64').then((data) => {
              return `data:${file.type};base64,${data}`;
            });
            imagePromises.push(promise);
          }
        });

        Promise.all(imagePromises).then((images) => {
          setImages(images);
        });
      });
    };

    reader.readAsArrayBuffer(folder);
  };

  return (
    <div className="bg-eco-gray rounded-lg flex flex-col justify-between mx-2 px-4 h-[40rem]">
      <div className='w-full bg-gray-300 self-start mr-4 mt-4 rounded-lg'>
        <label id="upload-yolo-model-label" className="block text-lg font-semibold m-2">Upload Yolo Model Folder</label>
        <input
          type="file"
          accept=".zip" // Allow users to upload only zip files
          onChange={handleFolderUpload}
          className="m-4"
        />
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
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