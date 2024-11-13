import axios from "axios";

const apiUrl = "http://103.159.68.52:8000/api/";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchHeaders = async () => {
  try {
    const response = await axios.get(`${apiUrl}getheader`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching headers:", error);
    throw error;
  }
};

export const fetchCommodities = async () => {
  try {
    const response = await axios.get(`${apiUrl}getcommodity`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching commodities:", error);
    throw error;
  }
};

export const fetchSubcommodities = async (commodity) => {
  try {
    const response = await axios.post(
      `${apiUrl}getsubcommodity`,
      { code: commodity },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subcommodities:", error);
    throw error;
  }
};

export const submitPart = async (payload) => {
  try {
    const response = await axios.post(`${apiUrl}createpartNumber`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting part:", error);
    throw error;
  }
};

export const fetchAllPartNumbers = async () => {
  try {
    const response = await axios.get(`${apiUrl}getpartNumber`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all part numbers:", error);
    throw error;
  }
};
