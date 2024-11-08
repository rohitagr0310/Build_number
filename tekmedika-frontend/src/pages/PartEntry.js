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

  const [headerDefinition, setHeaderDefinition] = useState("");
  const [commodityDefinition, setCommodityDefinition] = useState("");
  const [subcommodityDefinition, setSubcommodityDefinition] = useState("");

  const [partInputVisible, setPartInputVisible] = useState(false);

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
            definition: header.Definition,
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
            definition: commodity.Definition,
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
              definition: subcommodity.Definition,
            }))
          );
        })
        .catch((error) =>
          console.error("Error fetching subcommodities:", error)
        );
    }
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
      (item) => item.value === selectedSubcommodity
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
        {subcommodityDefinition && (
          <p className="text-gray-400 mt-1">{subcommodityDefinition}</p>
        )}
      </div>

      <label className="block font-semibold mb-1">Description</label>
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
