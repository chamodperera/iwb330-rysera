// types.ts
export interface FileState {
    file: File;
    status: 'idle' | 'uploading' | 'uploaded' | 'error' | 'estimated';
    uploadProgress: number;
    url?: string;
    volume?: number;
    isEstimating?: boolean;
    material?: Material;
    quality?: 'normal' | 'high';
    color?: string;
    infill?: number;
    initialPrice?: number;
  }
  
  export interface Material {
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
  
  export interface EstimatedValue {
    price: number;
    time: string;
    weight: number;
  }
