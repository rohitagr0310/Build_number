import React, { useState, useEffect } from "react";
import {
  fetchSubassemblies,
  createSubassembly,
  updateSubassembly,
} from "../services/BomAPI"; // Import API functions

const BOMCreation = () => {
  const [bomStructure, setBOMStructure] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch BOM structure from the API
  useEffect(() => {
    const loadBOMStructure = async () => {
      setLoading(true);
      try {
        const response = await fetchSubassemblies();
        if (response.subassemblies && response.subassemblies.length > 0) {
          setBOMStructure(response.subassemblies);
        } else {
          // Default BOM structure is empty for multiple root support
          setBOMStructure([]);
        }
      } catch (error) {
        console.error("Error fetching BOM structure:", error);
        setBOMStructure([]);
      } finally {
        setLoading(false);
      }
    };

    loadBOMStructure();
  }, []);

  // Add a new BOM item
  const addBOMItem = (parentId) => {
    const newItem = {
      id: parentId
        ? `${parentId}-${Date.now()}` // Unique ID for subassemblies
        : `root-${Date.now()}`, // Unique ID for root assemblies
      manufacturer: "",
      partNumber: "",
      description: "",
      quantity: "",
      children: [],
    };

    if (parentId === null) {
      // Add new root item
      setBOMStructure((prevStructure) => [...prevStructure, newItem]);
    } else {
      // Add subassembly under the specified parent
      const addItemRecursively = (items) =>
        items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...item.children, newItem],
            };
          }

          if (item.children) {
            return {
              ...item,
              children: addItemRecursively(item.children),
            };
          }

          return item;
        });

      setBOMStructure((prevStructure) => addItemRecursively(prevStructure));
    }
  };

  // Update a BOM item
  const updateBOMItem = (itemId, field, value) => {
    const updateItemRecursively = (items) =>
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }

        if (item.children) {
          return {
            ...item,
            children: updateItemRecursively(item.children),
          };
        }

        return item;
      });

    setBOMStructure((prevStructure) => updateItemRecursively(prevStructure));
  };

  // Save a BOM item to the backend
  const saveBOMItem = async (item) => {
    try {
      const payload = {
        name: `Subassembly ${item.id}`, // Example naming convention
        description: item.description,
        manufacturer: item.manufacturer,
        vendor: "Default Vendor", // Example placeholder
        quantity: item.quantity,
        part_numbers: [], // Adjust if part numbers are needed
        parent_id: item.id.includes("-")
          ? item.id.split("-").slice(0, -1).join("-")
          : null,
      };

      console.log(payload);

      if (item.isNew) {
        const response = await createSubassembly(payload);
        console.log("Subassembly created:", response);
      } else {
        const updatedPayload = { ...payload, id: item.id };
        const response = await updateSubassembly(updatedPayload);
        console.log("Subassembly updated:", response);
      }
    } catch (error) {
      console.error("Error saving BOM item:", error);
    }
  };

  // Recursive render function for BOM items
  const renderBOMItem = (item, depth = 0) => (
    <div key={item.id} className="mb-2">
      <div className="flex items-center space-x-2">
        <div
          className="grid grid-cols-5 gap-2 flex-grow"
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          <input
            placeholder="Manufacturer"
            value={item.manufacturer}
            onChange={(e) =>
              updateBOMItem(item.id, "manufacturer", e.target.value)
            }
            className="border p-1 bg-transparent"
          />
          <input
            placeholder="Part Number"
            value={item.partNumber}
            onChange={(e) =>
              updateBOMItem(item.id, "partNumber", e.target.value)
            }
            className="border p-1 bg-transparent"
          />
          <input
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              updateBOMItem(item.id, "description", e.target.value)
            }
            className="border p-1 bg-transparent"
          />
          <input
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => updateBOMItem(item.id, "quantity", e.target.value)}
            className="border p-1 bg-transparent"
          />
          <div className="flex space-x-1">
            <button
              onClick={() => addBOMItem(item.id)}
              className="flex items-center justify-center border p-1 hover:bg-gray-100"
            >
              +
            </button>
            <button
              onClick={() => saveBOMItem(item)}
              className="flex items-center justify-center border p-1 hover:bg-gray-100"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Recursively render children */}
      {item.children &&
        item.children.map((child) => renderBOMItem(child, depth + 1))}
    </div>
  );

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Bill of Materials</h1>
      <button
        onClick={() => addBOMItem(null)}
        className="mb-4 border p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Assembly
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-5 font-bold mb-2">
            <div>Manufacturer</div>
            <div>Part Number</div>
            <div>Description</div>
            <div>Quantity</div>
            <div>Actions</div>
          </div>
          {bomStructure.map((item) => renderBOMItem(item))}
        </>
      )}
    </div>
  );
};

export default BOMCreation;
