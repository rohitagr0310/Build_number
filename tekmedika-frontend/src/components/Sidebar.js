import React from "react";
import { NavLink } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory"; // Optional: for company logo

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: "/parts", label: "Parts List", icon: <ListAltIcon /> },
    {
      path: "/part-entry",
      label: "Part Entry",
      icon: <AddCircleOutlineIcon />,
    },
    { path: "/edit-table", label: "Edit Table", icon: <EditIcon /> },
  ];

  return (
    <div
      className={`bg-gray-800 text-white w-64 fixed md:relative inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition duration-200 ease-in-out z-30 flex flex-col h-full`}
    >
      {/* Company Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <InventoryIcon className="text-blue-500" fontSize="large" />
          <span className="text-xl font-bold">TekMedika</span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 flex flex-col justify-center">
        <div className="space-y-2 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start py-3 px-4 rounded transition duration-200 ${
                  isActive ? "bg-blue-500" : "hover:bg-gray-700"
                }`
              }
            >
              <span className="text-2xl md:text-base">{item.icon}</span>
              <span className="md:block ml-3">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
