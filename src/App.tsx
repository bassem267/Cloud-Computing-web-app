import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadString,
} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAIGJ0h9jKJtD-xm3NeTnw6ww1Jxz3RrJM",
  authDomain: "cloud-computing-2616f.firebaseapp.com",
  databaseURL:
    "https://cloud-computing-2616f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cloud-computing-2616f",
  storageBucket: "cloud-computing-2616f.appspot.com",
  messagingSenderId: "910030302421",
  appId: "1:910030302421:web:de11384f908397e811c65c",
  measurementId: "G-EWRCXP4PZZ",
};

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const db = getFirestore(app);
const storage = getStorage();

function App() {
  const [file, setFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    try {
      if (!file) {
        console.error("No file selected.");
        return;
      }
  
      // Read the file as data URL
      const reader = new FileReader();
      reader.onload = async () => {
        // Create a reference to the storage location
        const imageRef = ref(storage, `images/${file?.name}`);
  
        // Check if the reader result is a string
        if (typeof reader.result === "string") {
          // Upload the file to Firebase Storage
          await uploadString(imageRef, reader.result, "data_url");
  
          // Get the download URL of the uploaded file
          const downloadURL = await getDownloadURL(imageRef);
          console.log(
            "Image uploaded successfully. Download URL:",
            downloadURL
          );
  
          // Fetch updated image URLs after upload
          fetchImageURLs();
        } else {
          console.error("Invalid file format.");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };  

  // Function to fetch all image URLs from Firebase Storage
  const [imageURLs, setImageURLs] = useState<{ url: string; name: string; }[]>([]);

  const fetchImageURLs = async () => {
    try {
      const imageFolderRef = ref(storage, "images");
      const imagesList = await listAll(imageFolderRef);
      const urls = await Promise.all(
        imagesList.items.map(async (imageRef) => {
          const downloadURL = await getDownloadURL(imageRef);
          return { url: downloadURL, name: imageRef.name };
        })
      );
      setImageURLs(urls);
    } catch (error) {
      console.error("Error fetching image URLs:", error);
    }
  };

  useEffect(() => {
    // Fetch image URLs when component mounts
    fetchImageURLs();
  }, []);

  return (
    <div className="App">
      <header className="py-10">
        <h1>Upload Images</h1>
      </header>
      <section>
        <div className="flex items-center justify-center py-10">
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadImage} className="text-white">
            Upload Image
          </button>
        </div>

        <div className="image-container flex flex-wrap justify-center">
          {imageURLs.map((image, index) => (
            <div key={index} className="w-1/3 aspect-square p-5">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full aspect-square object-contain"
              />
              <p className="text-center mt-2">{image.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
