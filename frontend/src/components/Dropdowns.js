import React from "react";

const Dropdowns = ({ label, value, setValue, options, disabled }) => {
  return (
    <div className="mr-4">
      <label className="block font-semibold mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-56 p-2 border rounded bg-gray-800 text-white"
        disabled={disabled} // Disable if passed as prop
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdowns;
