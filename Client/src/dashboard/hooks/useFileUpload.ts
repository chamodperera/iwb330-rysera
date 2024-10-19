import { useState } from "react";
import { FileState } from "../../types";
import { uploadFile } from "../../services/estimator";
import { UseUser } from "@/userContext";

export function useFileUpload() {
  const { fileStates, setFileStates } = UseUser();
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0); // Specify the type for clarity
  const [dragActive, setDragActive] = useState<boolean>(false); // Specify the type for clarity

  const upload = async (index: number, currentFileStates: FileState[]) => {
    setFileStates((prevStates: FileState[]) => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], status: "uploading" };
      return newStates; // Return the updated states
    });

    try {
      const result = await uploadFile(
        currentFileStates[index].file,
        (progress: number) => {
          setFileStates((prevStates: FileState[]) => {
            const newStates = [...prevStates];
            newStates[index] = {
              ...newStates[index],
              uploadProgress: progress,
            };
            return newStates; // Return the updated states
          });
        }
      );

      setFileStates((prevStates: FileState[]) => {
        const newStates = [...prevStates];
        newStates[index] = {
          ...newStates[index],
          status: "uploaded",
          url: result.url,
          volume: result.volume,
        };
        return newStates; // Return the updated states
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileStates((prevStates: FileState[]) => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], status: "error" };
        return newStates; // Return the updated states
      });
    }
  };

  return {
    fileStates,
    setFileStates,
    currentFileIndex,
    setCurrentFileIndex,
    dragActive,
    setDragActive,
    upload,
  };
}
