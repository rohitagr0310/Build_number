import React from "react";

const CartTable = ({ cart, setCart }) => {
  const removePart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  return (
    <div>
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
              <td className="border px-4 py-2">{item.header}</td>
              <td className="border px-4 py-2">{item.commodity}</td>
              <td className="border px-4 py-2">{item.subcommodity}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => removePart(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
