import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { useCallback, useEffect, useRef, useState } from "react";
import TRSButton from "./TRSButton";
import { FileUp } from "lucide-react";
import { useThesisStore } from "../../stores/useThesisStore";
import { thesisModel } from "../../models/thesisModel";
import Cookies from "js-cookie";
import Modal from "../modal/Modal";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return { signature: data.signature, expire: data.expire, token: data.token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const SubmitFile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advisers, setAdvisers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [chosenAdviser, setChosenAdviser] = useState({});

  const route = useThesisStore((state) => state.getCurrentRoute());
  const { createThesis, fetchAllAdvisers } = useThesisStore((state) => state);

  const fetchAdvisers = useCallback(async () => {
    const fetchedAd = await fetchAllAdvisers();
    setAdvisers(fetchedAd);
  }, [fetchAllAdvisers]);

  useEffect(() => {
    fetchAdvisers();
  }, [isModalOpen]);

  const onError = (err) => {
    console.error("Upload Error:", err);
    setUploading(false);
  };

  const onSuccess = async (res) => {
    console.log("Upload success:", res);
    try {
      await createThesis(
        thesisModel(
          res.name,
          res.url,
          Cookies.get("studentId"),
          [],
          {
            adviserId: chosenAdviser.id,
            name: chosenAdviser.name,
          },
          route
        )
      );
      setUploading(false);
      setIsModalOpen(false);
      setChosenAdviser({});
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const ikUploadRef = useRef(null);

  const onFileSelect = () => {
    setUploading(true);
    setTimeout(() => {
      if (ikUploadRef.current) {
        ikUploadRef.current.click(); 
      }
    }, 100); 
  };

  return (
    <div>
      <TRSButton onClick={() => setIsModalOpen(true)} label={<FileUp />} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setChosenAdviser({});
          setUploading(false);
        }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-3">Choose Adviser</h2>
          
          <h2 className="text-md font-bold text-red-600 my-2">Follow Naming Convention <br /> Ex: Group1_ESP32WifiServers_2025-03-01.pdf</h2>
          <div className="flex flex-col gap-4 my-5 max-h-68 overflow-y-auto">
            {advisers.map((adviser) => (
              <div
                className={`${
                  chosenAdviser.id === adviser.id ? "bg-gray-400" : "bg-gray-600"
                } transition-colors duration-500 ease-in-out cursor-pointer w-full p-4 rounded-lg`}
                onClick={() => setChosenAdviser(adviser)}
                key={adviser.id}
              >
                {adviser.name}
              </div>
            ))}
          </div>
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload
              style={{ display: "none" }}
              useUniqueFileName
              onError={onError}
              onSuccess={onSuccess}
              ref={ikUploadRef}
              onChange={onFileSelect} 
            />
            <button
              onClick={() => ikUploadRef.current.click()}
              className="bg-blue-600 font-bold text-lg hover:bg-blue-800 w-full rounded-lg p-4"
              type="button"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </ImageKitProvider>
        </div>
      </Modal>
    </div>
  );
};

export default SubmitFile;
