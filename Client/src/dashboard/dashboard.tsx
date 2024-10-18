import React, { useEffect,useState } from "react";
import { PlusIcon, TrashIcon, UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PLA from "../assets/PLA.png";
import ABS from "../assets/ABS.webp";
import PETG from "../assets/PETG.webp";
import TPU from "../assets/TPU.png";
import STLViewer from "./components/STLViewer";
import { Button } from "@/components/ui/button";
import Estimator from "./components/estimator";
import axios from 'axios';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const materialImages: { [key: string]: string } = {
  PLA: PLA,
  ABS: ABS,
  PETG: PETG,
  TPU: TPU,
};

export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [estimatedPrices, setEstimatedPrices] = useState<{
    [key: number]: number | null;
  }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setCurrentFileIndex(uploadedFiles.length); // Show the newly added file
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

  const handleEstimatePrice = (index: number) => {
    setLoadingStates((prevStates) => ({ ...prevStates, [index]: true }));
    // Simulate API call or price estimation process
    setTimeout(() => {
      const price = Math.random() * 100; // Simulated price
      setLoadingStates((prevStates) => ({ ...prevStates, [index]: false }));
      setEstimatedPrices((prevPrices) => ({ ...prevPrices, [index]: price }));
    }, 2000);
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
                onClick={handleAddFile}
                className="ml-2"
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
            {uploadedFiles.map((file, index) => (
              <div key={index} className="absolute bottom-16">
                {index === currentFileIndex && (
                  <Estimator
                    file={file}
                    loading={loadingStates[index] || false}
                    estimatedPrice={estimatedPrices[index] || null}
                    onEstimate={() => handleEstimatePrice(index)}
                  />
                )}
              </div>
            ))}

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
      

        <div className="w-full space-y-2 pl-16 pr-16 pt-8 ml-0 lg:pl-2 lg:pr-2 lg:pt-0 lg:ml-4 lg:w-1/4">
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
                <SelectItem value="0.12">0.12 - fine</SelectItem>
                <SelectItem value="0.16">0.16 - optimal</SelectItem>
                <SelectItem value="0.20">0.20 - standard</SelectItem>
                <SelectItem value="0.24">0.24 - draft</SelectItem>
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
        </div>
      </div>
    </div>
  );
}
