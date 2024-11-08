import React, { useState } from "react";

const EditTable = () => {
  const [headerCode, setHeaderCode] = useState("");
  const [headerDefinition, setHeaderDefinition] = useState("");
  const [revisedBy, setRevisedBy] = useState("");
  const [commodityCode, setCommodityCode] = useState("");
  const [commodityDefinition, setCommodityDefinition] = useState("");
  const [commodityRevisedBy, setCommodityRevisedBy] = useState("");
  const [subcommodityCode, setSubcommodityCode] = useState("");
  const [subcommodityDefinition, setSubcommodityDefinition] = useState("");
  const [subcommodityRevisedBy, setSubcommodityRevisedBy] = useState("");
  const [headerDetails, setHeaderDetails] = useState([]);
  const [commodityDetails, setCommodityDetails] = useState([]);
  const [showHeaderInput, setShowHeaderInput] = useState(false);
  const [showCommodityInput, setShowCommodityInput] = useState(false);
  const [showSubcommodityInput, setShowSubcommodityInput] = useState(false);

  const uppercaseRegex = /^[A-Z]$/;
  const apiBaseUrl = "http://103.159.68.52:8000/api";

  const getToken = () => localStorage.getItem("token");

  const toggleHeaderInput = () => {
    setShowHeaderInput((prev) => !prev);
  };

  const toggleCommodityInput = () => {
    setShowCommodityInput((prev) => !prev);
  };

  const toggleSubcommodityInput = () => {
    setShowSubcommodityInput((prev) => !prev);
  };

  const handleAddHeader = () => {
    if (!uppercaseRegex.test(headerCode)) {
      alert("Please Enter code as upper case");
      return;
    }

    fetch(`${apiBaseUrl}/createHeader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        code: headerCode,
        Definition: headerDefinition,
        revisedBy: revisedBy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.status);
        // Reset input fields
        setHeaderCode("");
        setHeaderDefinition("");
        setRevisedBy("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleShowHeaders = () => {
    fetch(`${apiBaseUrl}/getheader`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((headers) => {
        if (headers.length === 0) {
          setHeaderDetails(["No header details available."]);
        } else {
          setHeaderDetails(
            headers.map((header) => `Header Code: ${header.code}`)
          );
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleAddCommodity = () => {
    if (!uppercaseRegex.test(commodityCode)) {
      alert("Please Enter code as upper case");
      return;
    }

    fetch(`${apiBaseUrl}/createCommodity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        code: commodityCode,
        Definition: commodityDefinition,
        revisedBy: commodityRevisedBy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.status);
        // Reset input fields
        setCommodityCode("");
        setCommodityDefinition("");
        setCommodityRevisedBy("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleShowCommodities = () => {
    fetch(`${apiBaseUrl}/getcommodity`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((commodities) => {
        if (commodities.length === 0) {
          setCommodityDetails(["No commodity details available."]);
        } else {
          setCommodityDetails(
            commodities.map((commodity) => `Commodity Code: ${commodity.code}`)
          );
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit main Details</h1>
        </div>

        {/* Header Section */}
        <div className="flex items-center mb-4 justify-between">
          <label className="mr-4">Header:</label>
          <button
            onClick={toggleHeaderInput}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-4 mr-2"
          >
            Add
          </button>
          <button
            onClick={handleShowHeaders}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Show
          </button>
        </div>

        {showHeaderInput && (
          <div className="pt-[2vh] pb-[2vh]">
            <label htmlFor="headerCode" className="mr-2">
              Code:
            </label>
            <input
              type="text"
              id="headerCode"
              value={headerCode}
              onChange={(e) => setHeaderCode(e.target.value)}
              placeholder="Enter Header Code"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
              required
              maxLength={1}
            />
            <label htmlFor="headerDefinition" className="mr-2">
              Definition:
            </label>
            <input
              type="text"
              id="headerDefinition"
              value={headerDefinition}
              onChange={(e) => setHeaderDefinition(e.target.value)}
              placeholder="Enter Header Definition"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <label htmlFor="revisedBy" className="mr-2">
              Revised By:
            </label>
            <input
              type="text"
              id="revisedBy"
              value={revisedBy}
              onChange={(e) => setRevisedBy(e.target.value)}
              placeholder="Enter Revised By"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <button
              onClick={handleAddHeader}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        )}

        <div>
          {headerDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>

        {/* Commodity Section */}
        <div className="flex items-center mb-4 justify-between">
          <label className="mr-4">Commodity:</label>
          <button
            onClick={toggleCommodityInput}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-[-1vw] mr-2"
          >
            Add
          </button>
          <button
            onClick={handleShowCommodities}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Show
          </button>
        </div>

        {showCommodityInput && (
          <div className="pt-[2vh] pb-[2vh]">
            <label htmlFor="commodityCode" className="mr-2">
              Code:
            </label>
            <input
              type="text"
              id="commodityCode"
              value={commodityCode}
              onChange={(e) => setCommodityCode(e.target.value)}
              placeholder="Enter Commodity Code"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
              required
              maxLength={1}
            />
            <label htmlFor="commodityDefinition" className="mr-2">
              Definition:
            </label>
            <input
              type="text"
              id="commodityDefinition"
              value={commodityDefinition}
              onChange={(e) => setCommodityDefinition(e.target.value)}
              placeholder="Enter Commodity Definition"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <label htmlFor="commodityRevisedBy" className="mr-2">
              Revised By:
            </label>
            <input
              type="text"
              id="commodityRevisedBy"
              value={commodityRevisedBy}
              onChange={(e) => setCommodityRevisedBy(e.target.value)}
              placeholder="Enter Revised By"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <button
              onClick={handleAddCommodity}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        )}

        <div>
          {commodityDetails.map((detail, index) => (
            <div key={index}>{detail}</div>
          ))}
        </div>

        {/* Subcommodity Section */}
        <div className="flex items-center mb-4 justify-between">
          <label className="mr-4">Subcommodity:</label>
          <button
            onClick={toggleSubcommodityInput}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-[-1vw] mr-2"
          >
            Add
          </button>
        </div>

        {showSubcommodityInput && (
          <div className="pt-[2vh] pb-[2vh]">
            <label htmlFor="subcommodityCode" className="mr-2">
              Code:
            </label>
            <input
              type="text"
              id="subcommodityCode"
              value={subcommodityCode}
              onChange={(e) => setSubcommodityCode(e.target.value)}
              placeholder="Enter Subcommodity Code"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
              required
              maxLength={1}
            />
            <label htmlFor="subcommodityDefinition" className="mr-2">
              Definition:
            </label>
            <input
              type="text"
              id="subcommodityDefinition"
              value={subcommodityDefinition}
              onChange={(e) => setSubcommodityDefinition(e.target.value)}
              placeholder="Enter Subcommodity Definition"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <label htmlFor="subcommodityRevisedBy" className="mr-2">
              Revised By:
            </label>
            <input
              type="text"
              id="subcommodityRevisedBy"
              value={subcommodityRevisedBy}
              onChange={(e) => setSubcommodityRevisedBy(e.target.value)}
              placeholder="Enter Revised By"
              className="w-32 p-2 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white mr-4"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTable;
