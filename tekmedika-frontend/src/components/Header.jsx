import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ toggleSidebar, onLogout }) => {
    return (
        <header className="bg-gray-800 text-white p-4 z-20">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Toggle menu"
                    >
                        <MenuIcon fontSize="large" />
                    </button>
                    <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;