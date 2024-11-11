import axios from "axios";

const apiUrl = "http://103.159.68.52:8000/api/cart/";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Fetch the user's cart
export const fetchCartItems = async () => {
  try {
    const response = await axios.get(apiUrl, {
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
    const response = await axios.post(`${apiUrl}add`, itemData, {
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
      `${apiUrl}update`,
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
    const response = await axios.delete(`${apiUrl}remove/${itemId}`, {
      headers: getAuthHeaders(),
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
    const response = await axios.delete(`${apiUrl}clear`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
