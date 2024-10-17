import React, { useState } from "react";
import { PlusIcon, TrashIcon, UploadCloud } from "lucide-react";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PLA from "../assets/pla.png";
import STLViewer from "./components/STLViewer";
import { Button } from "@/components/ui/button";
import Estimator from "./components/estimator";
import {Pagination,PaginationContent,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious,} from "@/components/ui/pagination";


export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
  const [estimatedValues, setEstimatedValues] = useState<{[key: number]: { price: number; time: string; weight: number } | null;}>({});
  const [loadTimes, setLoadTimes] = useState<string[]>([]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setLoadingStates([...loadingStates, ...newFiles.map(() => false)]);
      setCurrentFileIndex(uploadedFiles.length); // Show the newly added file
      setLoadTimes([...loadTimes, ...newFiles.map(() => '')]);
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
      const newFiles = Array.from(event.dataTransfer.files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setCurrentFileIndex(uploadedFiles.length); // Show the newly added file
    }
  };

  const handleNextFile = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex + 1) % uploadedFiles.length);
  };

  const handleAddFile = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleLoadTime = (index: number, loadTime: string) => {
    const updatedLoadTimes = [...loadTimes];
    updatedLoadTimes[index] = loadTime;
    setLoadTimes(updatedLoadTimes);
  };

  const handleEstimateStart = (index: number) => {
    const updatedLoadingStates = [...loadingStates];
    updatedLoadingStates[index] = true;
    setLoadingStates(updatedLoadingStates);
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
        className={
          "flex flex-col items-center justify-center w-full col-span-1 border rounded-lg relative"
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFiles.length > 0 ? (
          <>
            <div className="flex place-self-end m-4 absolute top-0">
              <Button
                variant="outline"
                size="icon2"
                onClick={() => {
                  const newFiles = uploadedFiles.filter(
                    (_, index) => index !== currentFileIndex
                  );
                  setUploadedFiles(newFiles);
                  setCurrentFileIndex(
                    Math.min(currentFileIndex, newFiles.length - 1)
                  );
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

            <STLViewer file={uploadedFiles[currentFileIndex]} />
            <div className="absolute bottom-16">
              <Estimator
                file={uploadedFiles[currentFileIndex]}
                loading={loadingStates[currentFileIndex] || false}
                unit="mm"
                estimatedValues={estimatedValues[currentFileIndex]}
                loadTime={loadTimes[currentFileIndex]}
                onEstimateStart={() => handleEstimateStart(currentFileIndex)}
                onEstimateComplete={(price, time, weight) =>
                  handleEstimateComplete(currentFileIndex, price, time, weight)
                }
                onLoadTime={(loadTime) => handleLoadTime(currentFileIndex, loadTime)}
              />
            </div>

            <Pagination className="absolute bottom-0 mb-4">
              <PaginationPrevious onClick={handleNextFile} />
              <PaginationContent>
                {uploadedFiles.map((_, index) => (
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
