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
        setError("Failed to fetch part numbers");
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Part Numbers</h2>
      <table>
        <thead>
          <tr>
            <th>Code Header</th>
            <th>Code Commodity</th>
            <th>Code SubCommodity</th>
            <th>Cross Entries</th>
          </tr>
        </thead>
        <tbody>
          {partNumbers.map((part, index) => (
            <tr key={index}>
              <td>{part.code_header}</td>
              <td>{part.code_Commodity}</td>
              <td>{part.code_SubCommodity}</td>
              <td>
                {part.CrossEntry && part.CrossEntry.length > 0 ? (
                  <ul>
                    {part.CrossEntry.map((entry, i) => (
                      <li key={i}>
                        <strong>Index:</strong> {entry.index},
                        <strong> Definition:</strong> {entry.Definition},
                        <strong> Revision Number:</strong>{" "}
                        {entry.revisionNumber},<strong> Revised By:</strong>{" "}
                        {entry.revisedBy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Cross Entries"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartList;
