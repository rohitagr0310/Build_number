import axios from "axios";
import { CART_ENDPOINTS, getAuthHeaders } from "../config/config";

// Fetch the user's cart
export const fetchCartItems = async () => {
  try {
    const response = await axios.get(CART_ENDPOINTS.BASE, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Add a new item to the cart
export const addItemToCart = async (itemData) => {
  try {
    const response = await axios.post(CART_ENDPOINTS.ADD, itemData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

// Update an existing item in the cart
export const editCartItem = async (itemId, updatedData) => {
  try {
    const response = await axios.put(
      CART_ENDPOINTS.UPDATE,
      { itemId, ...updatedData },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove an item from the cart
export const removeCartItem = async (itemId) => {
  try {
    const data = { itemId };
    const response = await axios.post(CART_ENDPOINTS.REMOVE, data, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

// Clear the cart
export const clearCart = async () => {
  try {
    const response = await axios.delete(CART_ENDPOINTS.CLEAR, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
