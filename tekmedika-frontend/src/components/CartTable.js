import React, { useState, useEffect } from "react";
import Dropdowns from "./Dropdowns";
import { editCartItem, removeCartItem } from "../services/cartApi";
import { fetchSubcommodities } from "../services/api";
const CartTable = ({ cart, setCart, headers, commodities }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [subcommodities, setSubcommodities] = useState([]);
  const [commodity, setCommodity] = useState("");

  // Fetch subcommodities whenever commodity changes
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

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedItem({ ...cart[index] });
    setCommodity(cart[index].commodity); // Set the commodity of the item being edited
  };

  const handleSaveClick = async (index) => {
    try {
      const updatedCartFromAPI = await editCartItem(
        cart[index]._id,
        editedItem
      ); // Assuming each cart item has a unique `id`
      const updatedCart = cart.map((item, i) =>
        i === index
          ? updatedCartFromAPI.items.find(
              (updatedItem) => updatedItem._id === item._id
            )
          : item
      );
      console.log(updatedCart);
      setCart(updatedCart);
      setEditIndex(null);
    } catch (error) {
      alert(error.response.data.message);
      console.error("Failed to save changes:", error);
    }
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedItem(null);
  };

  const handleRemoveClick = async (index) => {
    try {
      await removeCartItem(cart[index]._id); // Assuming each cart item has a unique `id`
      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleDropdownChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
    if (field === "commodity") {
      setCommodity(value); // Update commodity state when commodity is changed
    }
  };

  const handleDescriptionChange = (e) => {
    setEditedItem((prev) => ({ ...prev, description: e.target.value }));
  };

  return (
    <div className=".overflow-x-scroll">
      <h2 className="text-2xl font-bold mt-6 mb-4">Cart</h2>
      <table className="min-w-full border-collapse border border-gray-600">
        <thead>
          <tr>
            <th className="border px-4 py-2">Part Number</th>
            <th className="border px-4 py-2">Header</th>
            <th className="border px-4 py-2">Commodity</th>
            <th className="border px-4 py-2">Sub Commodity</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.partNumber}</td>
              <td className="border px-4 py-2">
                {editIndex === index ? (
                  <Dropdowns
                    value={editedItem.header}
                    setValue={(value) => handleDropdownChange("header", value)}
                    options={headers}
                  />
                ) : (
                  item.header
                )}
              </td>
              <td className="border px-4 py-2">
                {editIndex === index ? (
                  <Dropdowns
                    value={editedItem.commodity}
                    setValue={(value) =>
                      handleDropdownChange("commodity", value)
                    }
                    options={commodities}
                  />
                ) : (
                  item.commodity
                )}
              </td>
              <td className="border px-4 py-2">
                {editIndex === index ? (
                  <Dropdowns
                    value={editedItem.subcommodity}
                    setValue={(value) =>
                      handleDropdownChange("subcommodity", value)
                    }
                    options={subcommodities}
                  />
                ) : (
                  item.subcommodity
                )}
              </td>
              <td className="border px-4 py-2">
                {editIndex === index ? (
                  <>
                    <span className="text-red-500">*</span>
                    <input
                      type="text"
                      value={editedItem.description}
                      onChange={handleDescriptionChange}
                      className="w-full p-2 border rounded bg-gray-800 text-white"
                    />
                  </>
                ) : (
                  item.description
                )}
              </td>
              <td className="border px-4 py-2">
                {editIndex === index ? (
                  <>
                    <button
                      onClick={() => handleSaveClick(index)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(index)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveClick(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
