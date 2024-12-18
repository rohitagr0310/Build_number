import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
import Dashboard from "./layouts/Dashboard";
import PartList from "./pages/PartList";
import PartEntry from "./pages/PartEntry";
import EditTable from "./pages/EditTable";
import { AuthProvider, useAuth } from "./context/AuthContext";
import BOMCreation from "./pages/BOMCreation";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Render a loading component while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/parts" />} />
            <Route path="parts" element={<PartList />} />
            <Route path="part-entry" element={<PartEntry />} />
            <Route path="edit-table" element={<EditTable />} />
            <Route path="bom" element={<BOMCreation />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
