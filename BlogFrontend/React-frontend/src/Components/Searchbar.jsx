import React, { useState } from 'react';

const Searchbar = ({ onSearch, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', inputValue);
        onSearch(inputValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setInputValue(value);
        if (value === '') {
            onSearch('');
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto flex">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder || 'Search blogs...'}
                className="w-full px-4 py-2 border border-zinc-300 rounded-l-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
            <button
                onClick={handleSearch}
                className="hover:cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-r-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                Search
            </button>
        </div>
    );
};

export default Searchbar;
