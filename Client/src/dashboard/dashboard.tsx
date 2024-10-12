import { UploadCloud, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import PLA from '../assets/pla.png';
import { useState } from 'react';

export default function PrintingService() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
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
      setUploadedFile(event.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Rysera - 3D Printing</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-gray-900">View Orders</button>
            <User className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 h-svh">
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
                PLA (Polylactic Acid) is an excellent 3D printing material because it's biodegradable, easy to print with, and produces high-quality, precise prints with minimal warping or odor.
              </p>
            </CardContent>
          </Card>

          {/* Upload Area (Center) */}
          <div className="flex items-center justify-center w-full col-span-1">
        <div
          className={`border-2 border-dashed rounded-lg h-full w-full flex flex-col items-center justify-center ${dragActive ? 'border-blue-500' : 'border-gray-200'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <p className="text-gray-600">
              Drag your 3D model here, or{' '}
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                Browse
                <input
                  type="file"
                  accept=".stl"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-sm text-gray-500 mt-2">.STL files up to 200mb</p>
            {uploadedFile && (
              <p className="text-sm text-gray-500 mt-2">
                Uploaded file: {uploadedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

          {/* Settings Panel (Right) */}
          <div className='w-1/4'>
            <div className="space-y-6">
              {/* Quality Selector */}
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
      </div>
    </div>
  );
}
