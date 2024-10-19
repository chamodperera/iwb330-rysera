import api from "./api";
import { Order } from "../types";

export const getOrders = async () => {
  try {
    // Call the backend Google login endpoint, passing the JWT as a query parameter
    // Retrieve the JWT from localStorage (or sessionStorage, depending on where you store it)
    const jwtToken = sessionStorage.getItem("googleAuthToken"); // Adjust this if you store the token elsewhere

    if (!jwtToken) {
      throw new Error("No JWT found in localStorage");
    }

    // Call the backend Google login endpoint, passing the JWT as a query parameter
    const response = await api.get(`/getOrders`, {
      params: {
        jwt: jwtToken, // Send the JWT as a query parameter
      },
    });
    //check whether user is registered
    return response.data;
  } catch (error) {
    console.error("Failed retrieving orders", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

export const sendOrders = async (orders: Order[]) => {
  try {
    // Retrieve the JWT from localStorage (or sessionStorage, depending on where you store it)
    const jwtToken = sessionStorage.getItem("googleAuthToken"); // Adjust this if you store the token elsewhere

    if (!jwtToken) {
      throw new Error("No JWT found in localStorage");
    }

    // Call the backend Google login endpoint, passing the JWT as a query parameter
    const response = await api.post(`/setOrders`, orders, {
      params: {
        jwt: jwtToken, // Send the JWT as a query parameter
      },
    });

    return response.data;
  } catch (error) {
    console.error("An error occured while adding orders", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};
