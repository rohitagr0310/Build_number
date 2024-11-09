import React, { useState, useEffect } from "react";
import { Button, Stack, SnackbarContent } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchHeaders,
  fetchCommodities,
  fetchSubcommodities,
  submitPart,
} from "../services/api";
import CartTable from "../components/CartTable";
import Dropdowns from "../components/Dropdowns";

const PartEntry = () => {
  const [cart, setCart] = useState([]);
  const [header, setHeader] = useState("");
  const [commodity, setCommodity] = useState("");
  const [subcommodity, setSubcommodity] = useState("");
  const [description, setDescription] = useState("");
  const [partNumber, setPartNumber] = useState("");

  const [headers, setHeaders] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [subcommodities, setSubcommodities] = useState([]);

  const [headerDefinition, setHeaderDefinition] = useState("");
  const [commodityDefinition, setCommodityDefinition] = useState("");
  const [subcommodityDefinition, setSubcommodityDefinition] = useState("");

  const [partInputVisible, setPartInputVisible] = useState(false);

  // Snackbar messages array
  const [snackbars, setSnackbars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerData = await fetchHeaders();
        setHeaders(
          headerData.map((header) => ({
            value: header.code,
            label: header.code,
            definition: header.Definition,
          }))
        );

        const commodityData = await fetchCommodities();
        setCommodities(
          commodityData.map((commodity) => ({
            value: commodity.code,
            label: commodity.code,
            definition: commodity.Definition,
          }))
        );
      } catch (error) {
        console.error("Error fetching headers or commodities:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubData = async () => {
      if (commodity) {
        try {
          const subcommodityData = await fetchSubcommodities(commodity);
          setSubcommodities(
            subcommodityData.map((subcommodity) => ({
              value: subcommodity.index,
              label: subcommodity.index,
              definition: subcommodity.Definition,
            }))
          );
        } catch (error) {
          console.error("Error fetching subcommodities:", error);
        }
      }
    };
    fetchSubData();
  }, [commodity]);

  const handleHeaderChange = (selectedHeader) => {
    setHeader(selectedHeader);
    const selected = headers.find((item) => item.value === selectedHeader);
    setHeaderDefinition(selected ? selected.definition : "");
  };

  const handleCommodityChange = (selectedCommodity) => {
    setCommodity(selectedCommodity);
    const selected = commodities.find(
      (item) => item.value === selectedCommodity
    );
    setCommodityDefinition(selected ? selected.definition : "");
  };

  const handleSubcommodityChange = (selectedSubcommodity) => {
    setSubcommodity(selectedSubcommodity);
    const selected = subcommodities.find(
      (item) => item.value === Number(selectedSubcommodity)
    );
    setSubcommodityDefinition(selected ? selected.definition : "");
  };

  const addPart = () => {
    const newPart = {
      partNumber: "New Part",
      header,
      commodity,
      subcommodity,
      description,
    };
    setCart([...cart, newPart]);
  };

  const editPart = () => {
    setPartInputVisible(true);
  };

  const submitPartHandler = () => {
    const newPart = {
      partNumber,
      header,
      commodity,
      subcommodity,
      description,
    };
    setCart([...cart, newPart]);
    setPartInputVisible(false);
  };

  const submitAllParts = async () => {
    const newSnackbars = [];

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    for (let part of cart) {
      const payload = {
        header: part.header,
        Commodity: part.commodity,
        subCommodity: part.subcommodity,
        Part_No: part.partNumber || null,
        Definition: part.description,
        revisedBy: decoded.username, // Add the revisedBy field (replace "userName" with the actual user info)
      };

      try {
        await submitPart(payload);
        newSnackbars.push({
          message: `Part ${part.partNumber} submitted successfully!`,
          severity: "success",
        });
      } catch (error) {
        console.error("Error submitting part:", error);
        newSnackbars.push({
          message: `Failed to submit Part ${part.partNumber}.`,
          severity: "error",
        });
      }
    }
    setSnackbars(newSnackbars);
    setCart([]);
  };

  const handleCloseSnackbar = (index) => {
    setSnackbars(snackbars.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Part Entry Page</h1>
      <div className="flex mb-4">
        <Dropdowns
          label="Header"
          value={header}
          setValue={handleHeaderChange}
          options={headers}
        />
        {headerDefinition && (
          <p className="text-gray-400 mt-1">{headerDefinition}</p>
        )}
      </div>
      <div className="flex mb-4">
        <Dropdowns
          label="Commodity"
          value={commodity}
          setValue={handleCommodityChange}
          options={commodities}
        />
        {commodityDefinition && (
          <p className="text-gray-400 mt-1">{commodityDefinition}</p>
        )}
      </div>
      <div className="flex mb-4">
        <Dropdowns
          label="Sub Commodity"
          value={subcommodity}
          setValue={handleSubcommodityChange}
          options={subcommodities}
          disabled={!commodity}
        />
        <p className="text-gray-400 mt-1">{subcommodityDefinition}</p>
      </div>

      <label className="block font-semibold mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Description"
        className="w-full p-2 border rounded bg-gray-800 text-white mb-4"
      />

      <div className="flex mb-4">
        <Button
          onClick={addPart}
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
        >
          Add Part
        </Button>
        <Button onClick={editPart} variant="contained" color="secondary">
          Edit Part
        </Button>
      </div>

      {partInputVisible && (
        <div className="mt-4">
          <label htmlFor="partNumber" className="block font-semibold mb-1">
            Part Number (001-999)
          </label>
          <input
            type="number"
            min="1"
            max="999"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            className="w-56 p-2 border rounded bg-gray-800 text-white mb-4"
          />
          <Button
            onClick={submitPartHandler}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      )}

      <CartTable cart={cart} setCart={setCart} />
      <Button
        onClick={submitAllParts}
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        Submit All Parts
      </Button>

      {/* Stack to display multiple SnackbarContents */}
      <Stack spacing={2} sx={{ maxWidth: 600, mt: 4 }}>
        {snackbars.map((snackbar, index) => (
          <SnackbarContent
            key={index}
            message={snackbar.message}
            sx={{
              backgroundColor:
                snackbar.severity === "success" ? "lightgreen" : "#ffcccb",
              color: "black",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
            }}
            action={
              <Button
                color="secondary"
                size="small"
                onClick={() => handleCloseSnackbar(index)}
              >
                <CloseIcon fontSize="small" />
              </Button>
            }
          />
        ))}
      </Stack>
    </div>
  );
};

export default PartEntry;
