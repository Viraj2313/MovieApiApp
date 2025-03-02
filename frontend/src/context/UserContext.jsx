import { createContext, useContext, useState, useEffect } from "react";
import { getUserIdFromToken } from "../utils/GetUserIdFromToken";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserIdFromToken(setUserId);
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
