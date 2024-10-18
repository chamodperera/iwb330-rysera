import { useState } from 'react';
import { FileState } from '../types';
import { uploadFile } from '../../services/estimator';

export function useFileUpload() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const upload = async (index: number, currentFileStates: FileState[]) => {
    setFileStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], status: 'uploading' };
      return newStates;
    });

    try {
      const result = await uploadFile(currentFileStates[index].file, (progress: number) => {
        setFileStates(prevStates => {
          const newStates = [...prevStates];
          newStates[index] = { ...newStates[index], uploadProgress: progress };
          return newStates;
        });
      });

      setFileStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = {
          ...newStates[index],
          status: 'uploaded',
          url: result.url,
          volume: result.volume
        };
        return newStates;
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], status: 'error' };
        return newStates;
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
    upload
  };
}