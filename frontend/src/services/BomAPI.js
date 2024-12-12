import axios from "axios";

const apiUrl = "http://103.159.68.52:8000/api/subassemblies"; // Updated API URL for subassemblies

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Fetch all subassemblies
export const fetchSubassemblies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/getall`, {
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
      `${apiUrl}/get`,
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
    const response = await axios.post(`${apiUrl}/create`, payload, {
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
    const response = await axios.put(`${apiUrl}/update`, payload, {
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
    const response = await axios.delete(`${apiUrl}/delete`, {
      data: { id },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting subassembly:", error);
    throw error;
  }
};
