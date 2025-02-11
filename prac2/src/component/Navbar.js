import React, { useState } from 'react';
import { FaSearch, FaHome, FaUser, FaInfoCircle } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
// import { useRouter } from 'next/router';

const Navbar = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchInput.trim() === '') return; // Prevent empty searches
        navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="bg-blue-600 p-4 flex items-center justify-between md:px-8 fixed top-0 w-full shadow-md z-50">
                {/* App Name */}
                <div className="text-white text-lg font-bold">BlogApp</div>

                {/* Search Bar Toggle Button */}
                <button onClick={() => setSearchOpen(!searchOpen)} className="text-white text-xl">
                    <FaSearch />
                </button>

                {/* Desktop Navbar Links */}
                <ul className="hidden md:flex md:items-center md:gap-6">
                    <li className="text-white hover:text-gray-200 cursor-pointer"><NavLink to={'/'} >Home</NavLink></li>
                    <li className="text-white hover:text-gray-200 cursor-pointer"><NavLink to={'/profile'} >Profile</NavLink></li>
                    <li className="text-white hover:text-gray-200 cursor-pointer"><NavLink to={'/about'} >About</NavLink></li>
                </ul>
            </nav>

            {/* Search Bar Dropdown */}
            {searchOpen && (
                <div className="fixed top-16 left-0 w-full bg-white p-3 shadow-md flex items-center gap-2 z-10"
                    style={{ marginTop: '-4px', paddingBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 rounded-md border w-full outline-none"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-md" onClick={handleSearch}>Search</button>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-blue-600 p-2 flex justify-around md:hidden z-10 shadow-lg">
                <NavLink to={'/'} ><FaHome className="text-white text-3xl cursor-pointer" /></NavLink>
                <NavLink to={'/profile'} ><FaUser className="text-white text-3xl cursor-pointer" /></NavLink>
                <NavLink to={'/about'} ><FaInfoCircle className="text-white text-3xl cursor-pointer" /></NavLink>
            </div>
        </>
    );
};

export default Navbar;
