import React, { useEffect,useState } from "react";
import { PlusIcon, TrashIcon, UploadCloud } from "lucide-react";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PLA from "../assets/PLA.png";
import ABS from "../assets/ABS.webp";
import PETG from "../assets/PETG.webp";
import TPU from "../assets/TPU.png";
import STLViewer from "./components/STLViewer";
import { Button } from "@/components/ui/button";
import Estimator from "./components/estimator";
import axios from 'axios';import {Pagination,PaginationContent,PaginationItem,PaginationLink,PaginationNext,PaginationPrevious,} from "@/components/ui/pagination";
import { uploadFile } from "../services/estimator";
import PriceSummary from "./components/priceSummery";

interface FileState {
  file: File;
  status: 'idle' | 'uploading' | 'uploaded' | 'error' | 'estimating' | 'estimated';
  uploadProgress: number;
  url?: string;
  volume?: number;
  isEstimating?: boolean; 
}

const materialImages: { [key: string]: string } = {
  PLA: PLA,
  ABS: ABS,
  PETG: PETG,
  TPU: TPU,
};

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
  
  interface Material {
    name: string;
    description: string;
    properties: {
      Tensile: string;
      elongation: string;
      Flexural: string;
      HDT: string;
    };
    colors: string[];
  }

  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await axios.get('/materials.json');
      setMaterials(response.data);
      const defaultMaterial = response.data.find((mat: Material) => mat.name === "PLA");
      setSelectedMaterial(defaultMaterial);
    };

    fetchMaterials();
  }, []);

  const handleMaterialChange = (e: string) => {
    const material = materials.find(mat => mat.name === e);
    if (material) {
      setSelectedMaterial(material);
    }
  };



  return (
    <div className="flex gap-4 h-[80vh]">
      {/* PLA Info Card (Left) */}
      <Card className="p-6 w-1/5 hidden lg:block">
        <div className="mb-2">
        <img
            src={selectedMaterial ? materialImages[selectedMaterial.name] : PLA}
            alt={selectedMaterial ? `${selectedMaterial.name} Filament` : "Material"}
            className="w-full h-auto rounded-lg"
        />
        </div>
        <CardContent className="p-0">
        {selectedMaterial && (
        <div>
          <p className="font-semibold">{selectedMaterial.name}</p>
          <p className="text-sm mb-3">{selectedMaterial.description}</p>
          <p className="text-sm"><strong>Tensile strength:</strong> {selectedMaterial.properties.Tensile}</p>
          <p className="text-sm"><strong>Tensile elongation:</strong> {selectedMaterial.properties.elongation}</p>
          <p className="text-sm"><strong>Flexural strength:</strong> {selectedMaterial.properties.Flexural}</p>
          <p className="text-sm"><strong>HDT (0.45 MPa):</strong> {selectedMaterial.properties.HDT}</p>
        </div>
      )}
        </CardContent>
      </Card>

      {/* Upload Area or STL Viewer (Center) */}
      <div className="flex flex-row flex-grow flex-wrap justify-center lg:flex-nowrap">
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
              <p>Preparing your file...</p>
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
            className={`flex flex-col items-center justify-center border-2 border-dashed p-8 lg:p-16 rounded-lg ${
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
                .STL files up to 50mb
              </p>
            </div>
          </div>
          )}
        </div>
      

        <div className="flex flex-col w-full space-y-2 pl-16 pr-16 pt-8 ml-0 lg:pl-2 lg:pr-2 lg:pt-0 lg:ml-4 lg:w-1/4">
          {/* Material Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material type
            </label>
            <Select defaultValue="PLA" onValueChange={handleMaterialChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {materials.map(material => (
                <SelectItem key={material.name} value={material.name}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
            </Select>
          </div>
          
          {/* Settings Panel (Right) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <Select defaultValue="0.20">
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.20">Standard</SelectItem>
                <SelectItem value="0.24">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
              {selectedMaterial && (() => {
                const items = [];
                for (let i = 0; i < selectedMaterial.colors.length; i++) {
                  const color = selectedMaterial.colors[i];
                  items.push(
                    <SelectItem key={color.toLowerCase()} value={color.toLowerCase()}>
                      {color}
                    </SelectItem>
                  );
                }
                return items;
              })()}
              </SelectContent>
            </Select>
          </div>
          <PriceSummary fileStates={fileStates} estimatedValues={estimatedValues}/>
        </div>
      </div>
    </div>
  );
}
