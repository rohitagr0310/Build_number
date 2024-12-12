import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AUTH_ENDPOINTS } from "../config/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
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

  const signup = async (formData) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
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
