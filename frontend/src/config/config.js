const DEV_BASE_URL = "http://localhost:8000";
// const INSTANCE_BASE_URL = "http://103.159.68.52:8000";

export const AUTH_ENDPOINTS = {
  LOGIN: `${DEV_BASE_URL}/auth/login`,
  SIGNUP: `${DEV_BASE_URL}/auth/signup`,
};

export const API_ENDPOINTS = {
  GET_HEADER: `${DEV_BASE_URL}/api/getheader`,
  GET_COMMODITY: `${DEV_BASE_URL}/api/getcommodity`,
  GET_SUBCOMMODITY: `${DEV_BASE_URL}/api/getsubcommodity`,
  CREATE_PART_NUMBER: `${DEV_BASE_URL}/api/createpartNumber`,
  GET_PART_NUMBER: `${DEV_BASE_URL}/api/getpartNumber`,
};

export const SUBASSEMBLY_ENDPOINTS = {
  GET_ALL: `${DEV_BASE_URL}/api/subassemblies/getall`,
  GET: `${DEV_BASE_URL}/api/subassemblies/get`,
  CREATE: `${DEV_BASE_URL}/api/subassemblies/create`,
  UPDATE: `${DEV_BASE_URL}/api/subassemblies/update`,
  DELETE: `${DEV_BASE_URL}/api/subassemblies/delete`,
};

export const CART_ENDPOINTS = {
  BASE: `${DEV_BASE_URL}/api/cart`,
  ADD: `${DEV_BASE_URL}/api/cart/add`,
  UPDATE: `${DEV_BASE_URL}/api/cart/update`,
  REMOVE: `${DEV_BASE_URL}/api/cart/remove/`,
  CLEAR: `${DEV_BASE_URL}/api/cart/clear`,
};

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
