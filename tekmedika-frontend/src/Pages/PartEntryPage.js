import React, { useState, useEffect } from "react";
import CartTable from "../Components/CartTable";
import Dropdowns from "../Components/Dropdowns";

const PartEntryPage = () => {
  const [cart, setCart] = useState([]);
  const [header, setHeader] = useState("");
  const [commodity, setCommodity] = useState("");
  const [subcommodity, setSubcommodity] = useState("");
  const [description, setDescription] = useState("");
  const [partNumber, setPartNumber] = useState("");

  const [headers, setHeaders] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [subcommodities, setSubcommodities] = useState([]);

  const [partInputVisible, setPartInputVisible] = useState(false);

  useEffect(() => {
    // Fetch headers from Express backend on port 8000
    fetch("http://103.159.68.52:8000/getheader")
      .then((response) => response.json())
      .then((data) => {
        // Map the headers to extract the necessary fields
        setHeaders(
          data.map((header) => ({
            value: header.code,
            label: header.Definition, // Display the Definition as label
          }))
        );
      })
      .catch((error) => console.error("Error fetching headers:", error));

    // Fetch commodities from Express backend
    fetch("http://103.159.68.52:8000/getcommodity")
      .then((response) => response.json())
      .then((data) => {
        setCommodities(
          data.map((commodity) => ({
            value: commodity._id,
            label: commodity.Definition, // Adjust according to the returned structure
          }))
        );
      })
      .catch((error) => console.error("Error fetching commodities:", error));
  }, []);

  useEffect(() => {
    // Fetch subcommodities based on selected commodity
    if (commodity) {
      fetch(`http://103.159.68.52:8000/getsubcommodity?commodity=${commodity}`)
        .then((response) => response.json())
        .then((data) => {
          setSubcommodities(
            data.map((subcommodity) => ({
              value: subcommodity._id,
              label: subcommodity.Definition, // Adjust according to the returned structure
            }))
          );
        })
        .catch((error) =>
          console.error("Error fetching subcommodities:", error)
        );
    }
  }, [commodity]);

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

  const submitPart = () => {
    const newPart = {
      partNumber,
      header,
      commodity,
      subcommodity,
      description,
    };
    setCart([...cart, newPart]);
    setPartInputVisible(false); // Hide part number input after submission
  };

  const submitAllParts = async () => {
    for (let part of cart) {
      const payload = {
        header: part.header,
        Commodity: part.commodity,
        subCommodity: part.subcommodity,
        Part_No: part.partNumber || null,
        Definition: part.description,
      };

      try {
        const response = await fetch(
          "http://103.159.68.52:8000/createpartNumber",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        console.log(data.status);
      } catch (error) {
        console.error("Error submitting part:", error);
      }
    }
    setCart([]); // Clear the cart after submission
  };

  return (
    <div className="container mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Part Entry Page</h1>
      <div className="flex mb-4">
        <Dropdowns
          label="Header"
          value={header}
          setValue={setHeader}
          options={headers}
        />
        <Dropdowns
          label="Commodity"
          value={commodity}
          setValue={setCommodity}
          options={commodities}
        />
        <Dropdowns
          label="Sub Commodity"
          value={subcommodity}
          setValue={setSubcommodity}
          options={subcommodities}
          disabled={!commodity} // Disable subcommodity dropdown if no commodity is selected
        />
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter Description"
        className="w-full p-2 border rounded bg-gray-800 text-white mb-4"
      />

      <div className="flex mb-4">
        <button
          onClick={addPart}
          className="bg-blue-500 px-4 py-2 rounded mr-2"
        >
          Add Part
        </button>
        <button onClick={editPart} className="bg-green-500 px-4 py-2 rounded">
          Edit Part
        </button>
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
          <button
            onClick={submitPart}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      <CartTable cart={cart} setCart={setCart} />
      <button
        onClick={submitAllParts}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit All Parts
      </button>
    </div>
  );
};

export default PartEntryPage;
