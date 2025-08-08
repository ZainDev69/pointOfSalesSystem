import React, { createContext, useState, useContext } from "react";

// First, create the context
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleSearchChange }}>
      {children}
    </SearchContext.Provider>
  );
};

// Exporting the custom hook for consuming context
export const useSearch = () => useContext(SearchContext);
