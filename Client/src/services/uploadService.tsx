import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090';
const API_KEY = "d706148c-156a-4ac9-aa45-8856d88d157b";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    'x-api-key': API_KEY,
  },
  withCredentials: true,
});

export interface EstimateResponse {
  price: number;
  time: string;
}

export interface UploadResponse {
  url: string;
  volume: number;
}

export const api = {
  // Upload STL file
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<UploadResponse>('/upload', formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'File upload failed');
      }
      throw error;
    }
  },

//   Get price estimation
  getEstimate: async (url: string, weight: number): Promise<EstimateResponse> => {
    try {
      const response = await apiClient.post<EstimateResponse>('/estimate', {
        url,
        weight,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data || 'Estimation failed');
      }
      throw error;
    }
  },
};