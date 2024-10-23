import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PartEntryPage from "./Pages/PartEntryPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PartEntryPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
