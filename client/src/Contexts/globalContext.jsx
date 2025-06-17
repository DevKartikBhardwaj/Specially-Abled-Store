import { useContext, createContext, useState } from 'react';

// Create context - by convention PascalCase
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [baseAddress, setBaseAddress] = useState('http://localhost:3000');

    return (
      <GlobalContext.Provider value={{ baseAddress, setBaseAddress }}>
        {children}
      </GlobalContext.Provider>
    );
};
