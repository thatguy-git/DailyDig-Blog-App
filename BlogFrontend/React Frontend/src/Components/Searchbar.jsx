import React, { useState } from 'react';

const Searchbar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        onSearch(inputValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto flex">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search blogs..."
                className="w-full px-4 py-2 border border-zinc-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-teal-500 text-white rounded-r-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                Search
            </button>
        </div>
    );
};

export default Searchbar;
