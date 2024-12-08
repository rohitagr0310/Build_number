import React, { useState, useEffect } from "react";
import {
  fetchSubassemblies,
  createSubassembly,
  updateSubassembly,
} from "../services/BomAPI"; // Import API functions

const BOMCreation = () => {
  const [bomStructure, setBOMStructure] = useState([
    {
      id: "root-1",
      manufacturer: "",
      partNumber: "",
      description: "",
      quantity: "",
      children: [],
    },
  ]);
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
          // Default BOM structure if no data is returned
          setBOMStructure([
            {
              id: "root-1",
              manufacturer: "",
              partNumber: "",
              description: "",
              quantity: "",
              children: [],
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching BOM structure:", error);
        // Fallback to default structure in case of error
        setBOMStructure([
          {
            id: "root-1",
            manufacturer: "",
            partNumber: "",
            description: "",
            quantity: "",
            children: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadBOMStructure();
  }, []);

  // Add a new subassembly to the BOM structure
  const addBOMItem = (parentId) => {
    const addItemRecursively = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          const newItem = {
            id: `${parentId}-${(item.children?.length || 0) + 1}`,
            manufacturer: "",
            partNumber: "",
            description: "",
            quantity: "",
            children: [],
          };

          return {
            ...item,
            children: [...(item.children || []), newItem],
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
    };

    setBOMStructure((prevStructure) => addItemRecursively(prevStructure));
  };

  // Update a subassembly field
  const updateBOMItem = (itemId, field, value) => {
    const updateItemRecursively = (items) => {
      return items.map((item) => {
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
    };

    setBOMStructure((prevStructure) => updateItemRecursively(prevStructure));
  };

  // Save a subassembly to the backend
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
        // Create a new subassembly
        const response = await createSubassembly(payload);
        console.log("Subassembly created:", response);
      } else {
        // Update existing subassembly
        const updatedPayload = { ...payload, id: item.id };
        const response = await updateSubassembly(updatedPayload);
        console.log("Subassembly updated:", response);
      }
    } catch (error) {
      console.error("Error saving BOM item:", error);
    }
  };

  // Recursive render function for BOM items
  const renderBOMItem = (item, depth = 0) => {
    return (
      <div key={item.id} className="mb-2">
        <div className="flex items-center space-x-2">
          <div
            className="grid grid-cols-5 gap-4 flex-grow"
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
              onChange={(e) =>
                updateBOMItem(item.id, "quantity", e.target.value)
              }
              className="border p-1 bg-transparent"
            />
            <div className="flex space-x-1 gap-4">
              <button
                onClick={() => addBOMItem(item.id)}
                className="flex items-center justify-center border p-1"
              >
                +
              </button>
              <button
                onClick={() => saveBOMItem(item)}
                className="flex items-center justify-center border p-1"
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
  };

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Bill of Materials</h1>
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
