import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting

const FileUpload = () => {
  const [meetingTitle, setMeetingTitle] = useState(""); // Meeting title state
  const [file, setFile] = useState(null); // Uploaded file state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTitleChange = (event) => {
    setMeetingTitle(event.target.value); // Update meeting title
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*, video/*", // Allow audio and video files
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]); // Save the uploaded file
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    // Simulate uploading the file
    alert("File is being uploaded!");

    // Redirect to the Processing page after file upload
    navigate("/processing");
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {/* Meeting Title */}
        <div className="mb-4">
          <label htmlFor="meetingTitle" className="block text-sm font-medium text-gray-700">
            Meeting Title
          </label>
          <input
            type="text"
            id="meetingTitle"
            name="meetingTitle"
            value={meetingTitle}
            onChange={handleTitleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter meeting title"
          />
        </div>

        {/* File Upload */}
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-indigo-500 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-300"
        >
          <div {...getRootProps()} className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-12 h-12 mb-4 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm font-semibold text-indigo-700">
              <span className="text-indigo-800">Click or drag</span> to upload
            </p>
            <p className="text-xs text-indigo-600">MP3, MP4, WAV, or other audio/video files</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
        </label>

        {/* Show File Name and Size */}
        {file && (
          <div className="mt-4 text-center">
            <p className="font-semibold text-gray-800">File: {file.name}</p>
            <p className="text-sm text-gray-500">Size: {Math.round(file.size / 1024)} KB</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500"
          >
            Upload and Generate Document
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;


// import React, { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection

// const FileUpload = () => {
//   const [meetingTitle, setMeetingTitle] = useState(""); // Meeting title state
//   const [file, setFile] = useState(null); // Uploaded file state
//   const [audioUrl, setAudioUrl] = useState(null); // State to store audio URL after processing
//   const navigate = useNavigate(); // Initialize navigate function

//   const handleTitleChange = (event) => {
//     setMeetingTitle(event.target.value); // Update meeting title
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*, video/*", // Allow audio and video files
//     onDrop: (acceptedFiles) => {
//       setFile(acceptedFiles[0]); // Save the uploaded file
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     if (!file) {
//       alert("Please upload a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("video", file); // Append file to FormData
//     formData.append("meetingTitle", meetingTitle); // Append meeting title to FormData

//     try {
//       console.log("Backend API URL:", process.env.REACT_APP_API_URL);
//       const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAudioUrl(data.audioUrl); // Set the audio URL from backend response
//         alert("File uploaded successfully!");

//         // After successful upload, redirect to the processing page
//         navigate("/processing"); // Redirect to /processing page
//       } else {
//         console.error("Error in file upload:", response.statusText);
//         alert("Error uploading file.");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Error uploading file.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-full">
//       <form className="w-full max-w-lg" onSubmit={handleSubmit}>
//         {/* Meeting Title */}
//         <div className="mb-4">
//           <label htmlFor="meetingTitle" className="block text-sm font-medium text-gray-700">
//             Meeting Title
//           </label>
//           <input
//             type="text"
//             id="meetingTitle"
//             name="meetingTitle"
//             value={meetingTitle}
//             onChange={handleTitleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             placeholder="Enter meeting title"
//           />
//         </div>

//         {/* File Upload */}
//         <label
//           htmlFor="dropzone-file"
//           className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-indigo-500 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 focus:ring-4 focus:ring-indigo-300"
//         >
//           <div {...getRootProps()} className="flex flex-col items-center justify-center pt-5 pb-6">
//             <svg
//               className="w-12 h-12 mb-4 text-indigo-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//               />
//             </svg>
//             <p className="mb-2 text-sm font-semibold text-indigo-700">
//               <span className="text-indigo-800">Click or drag</span> to upload
//             </p>
//             <p className="text-xs text-indigo-600">MP3, MP4, WAV, or other audio/video files</p>
//           </div>
//           <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
//         </label>

//         {/* Show File Name and Size */}
//         {file && (
//           <div className="mt-4 text-center">
//             <p className="font-semibold text-gray-800">File: {file.name}</p>
//             <p className="text-sm text-gray-500">Size: {Math.round(file.size / 1024)} KB</p>
//           </div>
//         )}

//         {/* Submit Button */}
//         <div className="mt-4 flex justify-center">
//           <button
//             type="submit"
//             className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-500"
//           >
//             Upload and Generate Document
//           </button>
//         </div>
//       </form>

//       {/* Show Audio URL if Available */}
//       {audioUrl && (
//         <div className="mt-4 text-center">
//           <p className="font-semibold text-gray-800">Generated Audio:</p>
//           <audio controls>
//             <source src={audioUrl} type="audio/mp3" />
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;

