import React, { useEffect, useState } from "react";
import { fetchAllPartNumbers } from "../services/api"; // Assuming your API functions are in a file named api.js

const PartList = () => {
  const [partNumbers, setPartNumbers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllPartNumbers();
        setPartNumbers(data.data); // Accessing data array from the API response
      } catch (err) {
        if (err.status === 404) {
          setError("No part numbers found");
        } else {
          setError("Failed to fetch part numbers");
        }
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // Function to format and display the part number
  const formatPartNumber = (
    header,
    commodity,
    subcommodity,
    partNumber,
    revision
  ) => {
    return `${header}${commodity}${String(subcommodity).padStart(
      2,
      "0"
    )}${String(partNumber).padStart(3, "0")}-${String(revision).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-4">Part Numbers</h2>
      <table className="min-w-full border-collapse border border-gray-600">
        <thead>
          <tr>
            <th className="border px-4 py-2">Part Number</th>
            <th className="border px-4 py-2">Definition</th>
            <th className="border px-4 py-2">Revised By</th>
          </tr>
        </thead>
        <tbody>
          {partNumbers.map((part, index) => {
            // Get the header, commodity, subcommodity and revision data from the part
            const {
              code_header,
              code_Commodity,
              code_SubCommodity,
              CrossEntry,
            } = part;
            return CrossEntry.map((entry, subIndex) => {
              const {
                index: partIndex,
                Definition,
                revisedBy,
                revisionNumber,
              } = entry;
              const fullPartNumber = formatPartNumber(
                code_header,
                code_Commodity,
                code_SubCommodity,
                partIndex,
                revisionNumber
              );
              return (
                <tr key={`${index}-${subIndex}`}>
                  <td className="border px-4 py-2">{fullPartNumber}</td>
                  <td className="border px-4 py-2">{Definition}</td>
                  <td className="border px-4 py-2">{revisedBy}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PartList;
