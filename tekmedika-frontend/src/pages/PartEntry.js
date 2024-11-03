import React, { useState, useEffect } from "react";
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

  const [partInputVisible, setPartInputVisible] = useState(false);

  // Function to get token from localStorage
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetch("http://103.159.68.52:8000/api/getheader", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHeaders(
          data.map((header) => ({
            value: header.code,
            label: header.code,
          }))
        );
      })
      .catch((error) => console.error("Error fetching headers:", error));

    fetch("http://103.159.68.52:8000/api/getcommodity", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCommodities(
          data.map((commodity) => ({
            value: commodity.code,
            label: commodity.code,
          }))
        );
      })
      .catch((error) => console.error("Error fetching commodities:", error));
  }, []);

  useEffect(() => {
    if (commodity) {
      fetch("http://103.159.68.52:8000/api/getsubcommodity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ code: commodity }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSubcommodities(
            data.map((subcommodity) => ({
              value: subcommodity.index,
              label: subcommodity.index,
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
    setPartInputVisible(false);
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
          "http://103.159.68.52:8000/api/createpartNumber",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
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
    setCart([]);
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
          disabled={!commodity}
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

export default PartEntry;
