import React from "react";
import { Toaster } from "react-hot-toast";
import { useImageComposer } from "../hooks/useImageComposer";
import ImageComposerUI from "./ImageComposerUI";

const ImageComposer: React.FC = () => {
  const composerProps = useImageComposer();

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "500",
          },
        }}
      />
      <ImageComposerUI {...composerProps} />
    </>
  );
};

export default ImageComposer;
