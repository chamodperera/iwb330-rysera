import api from "./api";
import { UserData } from "../models";

// Define the function to handle Google login
export const handleLogin = async () => {
  try {
    // Retrieve the JWT from localStorage (or sessionStorage, depending on where you store it)
    const jwtToken = sessionStorage.getItem("googleAuthToken"); // Adjust this if you store the token elsewhere

    if (!jwtToken) {
      throw new Error("No JWT found in localStorage");
    }

    // Call the backend Google login endpoint, passing the JWT as a query parameter
    const response = await api.get(`/getUser`, {
      params: {
        jwt: jwtToken, // Send the JWT as a query parameter
      },
    });

    //check whether user is registered
    return response.data;
  } catch (error) {
    console.error("Google login failed", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

export const registerUser = async (data: UserData) => {
  try {
    // Retrieve the JWT from localStorage (or sessionStorage, depending on where you store it)
    const jwtToken = sessionStorage.getItem("googleAuthToken"); // Adjust this if you store the token elsewhere

    if (!jwtToken) {
      throw new Error("No JWT found in localStorage");
    }

    // Call the backend Google login endpoint, passing the JWT as a query parameter
    const response = await api.post(`/registerUser`, data, {
      params: {
        jwt: jwtToken, // Send the JWT as a query parameter
      },
    });

    return response.data;
  } catch (error) {
    console.error("Google login failed", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

// Optionally, you can add more auth functions (e.g., logout, refresh token, etc.)
export const logout = () => {
  // Clear any stored tokens or session data
  localStorage.removeItem("googleAuthToken");
};
