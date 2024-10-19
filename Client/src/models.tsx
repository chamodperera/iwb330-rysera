export interface UserData {
  name: string;
  contact: string;
  organization: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  avatar: string;
  organization: string;
  contact: string;
}

export interface Order {
  orderDate: string;
  uid: string;
  fileName: string;
  status: string;
  printTime: string;
  price: string;
  quantity: number;
}

export interface EstimateResponse {
  price: number;
  time: string;
}

export interface UploadResponse {
  url: string;
  volume: number;
}

export interface QuoteRequest { 
  customer: string;
  email: string;
  products: Product[];
}

export interface Product{
  name: string;
  rate: number;
  quantity: number;
}

export interface QuoteResponse {
  message: JSON;
}
