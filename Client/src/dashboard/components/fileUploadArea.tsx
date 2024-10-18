import { UploadCloud } from "lucide-react";

interface FileUploadAreaProps {
  dragActive: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadArea({ dragActive, onDragOver, onDragLeave, onDrop, onFileChange }: FileUploadAreaProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed p-8 lg:p-16 rounded-lg ${
        dragActive ? "border-blue-500" : "border-gray-200"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
              onChange={onFileChange}
            />
          </label>
        </p>
        <p className="text-sm text-gray-500 mt-2">.STL files up to 50mb</p>
      </div>
    </div>
  );
}