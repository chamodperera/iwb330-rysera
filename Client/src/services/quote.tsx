import api from "./api";
import { QuoteRequest, QuoteResponse } from "../types";

export const sendQuote = async (
  quote: QuoteRequest
): Promise<QuoteResponse> => {
  try {
    const response = await api.post<QuoteResponse>("/quote", quote);
    return response.data;
  } catch (error) {
    console.error("Quote failed", error);
    throw error;
  }
};
