import { useState } from "react";
// import AWS from 'aws-sdk'; // Import entire SDK (optional)
// import AWS from 'aws-sdk/global'; // Import global AWS namespace (recommended)
import S3 from "aws-sdk/clients/s3"; // Import only the S3 client

import "./App.css";

function App() {
  const [file, setFile] = useState(null);

  const fileTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFile = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile && fileTypes.includes(uploadedFile.type)) {
      setFile(uploadedFile);
    } else {
      alert("Please upload a valid file type!");
    }
  };

  const handleUpload = async () => {
    // temporary solution, convert to lambda later
    const s3 = new S3({
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Key: file.name,
      Body: file,
    };

    try {
      const upload = await s3.upload(params).promise();
      console.log(upload);
      alert("File uploaded successfully!");
    } catch (error) {
      console.log("Error uploading file: ", error);
      alert("Error uploading file! + error.message");
    }
  };

  return (
    <>
      <div className="m-14">
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="flex gap-3">
              <label
                htmlFor="first_name"
                className="w-20 mb-2 flex items-center text-sm font-medium text-gray-900 dark:text-white"
              >
                Text Input:
              </label>
              <input
                type="text"
                id="first_name"
                className="block w-72 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <label
              className="w-20 mb-2 flex items-center text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file:
            </label>
            <input
              className="block w-72 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              required
              onChange={handleFile}
            />
          </div>

          <button
            type="submit"
            className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => handleUpload()}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
