import axios from "axios";
import { API_ENDPOINTS, getAuthHeaders } from "../config/config";

export const fetchHeaders = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_HEADER, {
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
    const response = await axios.get(API_ENDPOINTS.GET_COMMODITY, {
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
      API_ENDPOINTS.GET_SUBCOMMODITY,
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
    const response = await axios.post(
      API_ENDPOINTS.CREATE_PART_NUMBER,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting part:", error);
    throw error;
  }
};

export const fetchAllPartNumbers = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_PART_NUMBER, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all part numbers:", error);
    throw error;
  }
};
