import React, { useState } from "react";
import { PlusIcon, TrashIcon, UploadCloud } from "lucide-react";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PLA from "../assets/pla.png";
import STLViewer from "./components/STLViewer";
import { Button } from "@/components/ui/button";
import Estimator from "./components/estimator";
import {Pagination,PaginationContent,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious,} from "@/components/ui/pagination";
import { getEstimate, uploadFile } from "../services/estimator";

interface FileState {
  file: File;
  status: 'idle' | 'uploading' | 'uploaded' | 'error' | 'estimating' | 'estimated';
  uploadProgress: number;
  url?: string;
  volume?: number;
  isEstimating?: boolean; 
}

export default function Dashboard() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [estimatedValues, setEstimatedValues] = useState<{[key: number]: { price: number; time: string; weight: number } | null;}>({});
  const [loadTimes, setLoadTimes] = useState<string[]>([]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const newFileStates: FileState[] = newFiles.map(file => ({
        file,
        status: 'idle',
        uploadProgress: 0
      }));
      
      setFileStates(prevStates => {
        const updatedStates = [...prevStates, ...newFileStates];
        // Start uploading each new file after state update
        newFileStates.forEach((_, index) => {
          upload(prevStates.length + index, updatedStates);
        });
        return updatedStates;
      });

      setCurrentFileIndex(fileStates.length);
      setLoadTimes(prevTimes => [...prevTimes, ...newFiles.map(() => '')]);
    }
  };

  const upload = async (index: number, currentFileStates: FileState[]) => {
    setFileStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], status: 'uploading' };
      return newStates;
    });

    try {
      const result = await uploadFile(currentFileStates[index].file, (progress: any) => {
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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: event.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleNextFile = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex + 1) % fileStates.length);
  };
  const handleAddFile = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleLoadTime = (index: number, loadTime: string) => {
    setLoadTimes(prevTimes => {
      const newTimes = [...prevTimes];
      newTimes[index] = loadTime;
      return newTimes;
    });
  };

  const handleEstimateStart = (index: number) => {
    setEstimatedValues((prevValues) => ({
      ...prevValues,
      [index]: null,
    }));
  };

  const handleEstimateComplete = (index: number, price: number, time: string, weight: number) => {
    setEstimatedValues((prevValues) => ({
      ...prevValues,
      [index]: { price, time, weight },
    }));
  };


  return (
    <div className="flex gap-6 h-[85vh]">
      {/* PLA Info Card (Left) */}
      <Card className="p-6 w-1/4">
        <div className="mb-6">
          <img
            src={PLA}
            alt="PLA Filament"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <CardContent className="p-0">
          <p className="text-gray-600">
            PLA (Polylactic Acid) is an excellent 3D printing material because
            it's biodegradable, easy to print with, and produces high-quality,
            precise prints with minimal warping or odor.
          </p>
        </CardContent>
      </Card>

      {/* Upload Area or STL Viewer (Center) */}
      <div
        className="flex flex-col items-center justify-center w-full col-span-1 border rounded-lg relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileStates.length > 0 ? (
          <>
            <div className="flex place-self-end m-4 absolute top-0">
              <Button
                variant="outline"
                size="icon2"
                onClick={() => {
                  setFileStates(prevStates => prevStates.filter((_, index) => index !== currentFileIndex));
                  setCurrentFileIndex(prevIndex => Math.min(prevIndex, fileStates.length - 2));
                }}
              >
                <TrashIcon color="red" className="h-8 w-8" />
              </Button>
              <Button
                variant="outline"
                size="icon2"
                className="ml-2"
                onClick={handleAddFile}
              >
                <PlusIcon className="h-8 w-8" />
                <input
                  id="fileInput"
                  type="file"
                  accept=".stl"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
            </div>

            {fileStates[currentFileIndex].status === 'uploading' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="mt-4">Uploading: {fileStates[currentFileIndex].uploadProgress.toFixed(0)}%</p>
            </div>
          ) : fileStates[currentFileIndex].status === 'uploaded' ? (
            <STLViewer file={fileStates[currentFileIndex].file} />
          ) : fileStates[currentFileIndex].status === 'error' ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-red-500">Error uploading file. Please try again.</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p>Preparing to upload...</p>
            </div>
          )}

<div className="absolute bottom-16">
  <Estimator
    unit="mm"
    status={fileStates[currentFileIndex].status}
    isEstimating={fileStates[currentFileIndex].isEstimating}
    estimatedValues={estimatedValues[currentFileIndex]}
    loadTime={loadTimes[currentFileIndex]}
    onEstimateStart={() => {
      setFileStates(prevStates => {
        const newStates = [...prevStates];
        newStates[currentFileIndex] = {
          ...newStates[currentFileIndex],
          isEstimating: true
        };
        return newStates;
      });
      handleEstimateStart(currentFileIndex);
    }}
    onEstimateComplete={(price, time, weight) => {
      setFileStates(prevStates => {
        const newStates = [...prevStates];
        newStates[currentFileIndex] = {
          ...newStates[currentFileIndex],
          isEstimating: false
        };
        return newStates;
      });
      handleEstimateComplete(currentFileIndex, price, time, weight);
    }}
    onLoadTime={(loadTime) => handleLoadTime(currentFileIndex, loadTime)}
    uploadedUrl={fileStates[currentFileIndex].url || ''}
    uploadedVolume={fileStates[currentFileIndex].volume || 0}
  />
</div>

            <Pagination className="absolute bottom-0 mb-4">
              <PaginationPrevious onClick={handleNextFile} />
              <PaginationContent>
                {fileStates.map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={index === currentFileIndex}
                      onClick={() => setCurrentFileIndex(index)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext onClick={handleNextFile} />
            </Pagination>
          </>
        ) : (
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed p-16 rounded-lg ${
              dragActive ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
            <div className="text-center">
              <p className="text-gray-600">
                Drag your 3D model here, or{" "}
                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                  Browse
                  <input
                    type="file"
                    accept=".stl"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                .STL files up to 200mb
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel (Right) */}
      <div className="w-1/4">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <Select defaultValue="0.12">
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.12">0.12 - fine</SelectItem>
                <SelectItem value="0.16">0.16 - medium</SelectItem>
                <SelectItem value="0.20">0.20 - draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Material Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material type
            </label>
            <Select defaultValue="pla">
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pla">PLA</SelectItem>
                <SelectItem value="abs">ABS</SelectItem>
                <SelectItem value="petg">PETG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <Select defaultValue="white">
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
