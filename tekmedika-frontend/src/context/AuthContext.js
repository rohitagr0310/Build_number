import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Check if token expiration time is in the past
    } catch (error) {
      return true; // If token decoding fails, assume it's invalid
    }
  };

  useEffect(() => {
    // Check token validity on initial load
    if (token) {
      if (isTokenExpired(token)) {
        logout(); // Logout if token is expired
      } else {
        setIsAuthenticated(true);
      }
    }
    setLoading(false); // Set loading to false after checking token
  }, [token]);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await fetch("http://103.159.68.52:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: data.message || "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Server error during login" };
    }
  };

  // Signup function
  const signup = async (formData) => {
    try {
      const response = await fetch("http://103.159.68.52:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful signup
        const loginResult = await login({
          username: formData.username,
          password: formData.password,
        });

        if (loginResult.success) {
          navigate("/");
          return { success: true };
        }
      }

      return {
        success: false,
        error: data.message || "Signup failed",
      };
    } catch (error) {
      return {
        success: false,
        error: "Error connecting to server",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
