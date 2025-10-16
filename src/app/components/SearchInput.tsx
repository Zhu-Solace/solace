import React, { memo, useState, useEffect } from 'react';

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchReset: () => void;
  disabled: boolean;
}

const SearchInput = memo(function SearchInput({ 
  searchTerm, 
  onSearchChange, 
  onSearchReset, 
  disabled 
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(searchTerm);

  useEffect(() => {
    if (searchTerm !== localValue) {
      setLocalValue(searchTerm);
    }
  }, [searchTerm, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    onSearchChange(e);
  };

  const handleReset = () => {
    setLocalValue("");
    onSearchReset();
  };

  return (
    <div className="mb-4 flex">
      <div className="relative flex-1">
        <input
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          placeholder="Search for an advocate..."
          disabled={disabled}
          value={localValue}
        />
      </div>
      <button
        disabled={disabled}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleReset}
      >
        Reset Search
      </button>
    </div>
  );
});

export default SearchInput;
