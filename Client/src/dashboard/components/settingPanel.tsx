import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Material } from "../../types";
import React from "react";

interface SettingsPanelProps {
  materials: Material[];
  selectedMaterial: Material | null;
  infillValue: number;
  quality: "normal" | "high";
  color: string;
  onMaterialChange: (value: string) => void;
  onInfillChange: (value: number[]) => void;
  onQualityChange: (quality: "normal" | "high") => void;
  onColorChange: (value: string) => void;
  children?: React.ReactNode;
}

export function SettingsPanel({
  materials,
  selectedMaterial,
  infillValue,
  quality,
  color,
  onMaterialChange,
  onInfillChange,
  onQualityChange,
  onColorChange,
  children,
}: SettingsPanelProps) {
  // Map quality values to display text
  const qualityOptions = {
    normal: "Standard",
    high: "High",
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material type
        </label>
        <Select
          value={selectedMaterial?.name || "PLA"}
          onValueChange={onMaterialChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {materials.map((material) => (
              <SelectItem key={material.name} value={material.name}>
                {material.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quality
        </label>
        <Select
          value={quality}
          onValueChange={(value) => onQualityChange(value as "normal" | "high")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">{qualityOptions.normal}</SelectItem>
            <SelectItem value="high">{qualityOptions.high}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <Select value={color.toLowerCase()} onValueChange={onColorChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {selectedMaterial?.colors.map((colorOption) => (
              <SelectItem
                key={colorOption.toLowerCase()}
                value={colorOption.toLowerCase()}
              >
                {colorOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Infill: {infillValue}%
        </label>
        <Slider
          value={[infillValue]}
          max={100}
          step={5}
          onValueChange={onInfillChange}
        />
      </div>

      {children}
    </div>
  );
}
