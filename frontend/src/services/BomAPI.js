import axios from "axios";
import { SUBASSEMBLY_ENDPOINTS, getAuthHeaders } from "../config/config";

// Fetch all subassemblies
export const fetchSubassemblies = async () => {
  try {
    const response = await axios.get(SUBASSEMBLY_ENDPOINTS.GET_ALL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subassemblies:", error);
    throw error;
  }
};

// Fetch a specific subassembly by ID
export const fetchSubassemblyById = async (id) => {
  try {
    const response = await axios.post(
      SUBASSEMBLY_ENDPOINTS.GET,
      { id },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subassembly by ID:", error);
    throw error;
  }
};

// Create a new subassembly
export const createSubassembly = async (payload) => {
  try {
    const response = await axios.post(SUBASSEMBLY_ENDPOINTS.CREATE, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subassembly:", error);
    throw error;
  }
};

// Update an existing subassembly
export const updateSubassembly = async (payload) => {
  try {
    const response = await axios.put(SUBASSEMBLY_ENDPOINTS.UPDATE, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subassembly:", error);
    throw error;
  }
};

// Delete a subassembly
export const deleteSubassembly = async (id) => {
  try {
    const response = await axios.delete(SUBASSEMBLY_ENDPOINTS.DELETE, {
      data: { id },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting subassembly:", error);
    throw error;
  }
};
