import { IKUpload, ImageKitProvider } from "imagekitio-next"
import { useRef } from "react";
import TRSButton from "./TRSButton";
import { FileUp } from "lucide-react";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const onError = (err) => {
    console.log("Error", err);
  };
  
  const onSuccess = (res) => {
    console.log("Success", res);
  };
  
const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const SubmitFile = () => {

  const ikUploadRef = useRef(null)
  
    return (
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
            <IKUpload style={{ display: "none"}} useUniqueFileName onError={onError} onSuccess={onSuccess} ref={ikUploadRef}/>
            <TRSButton onClick={() => ikUploadRef.current.click()} label={<FileUp />} />
        </ImageKitProvider>
    )
}

export default SubmitFile