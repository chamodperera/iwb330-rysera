import { SheetsData } from "@/types";
import api from "./api";

export const sendtoSheet = async (sheet: SheetsData) => {
  try {
    const response = await api.post("/sendToSheet", sheet);
    return response.data;
  } catch (error) {
    console.error("Failed to send data to sheet", error);
    throw error;
  }
};
