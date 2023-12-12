import { createContext, useState } from "react";

// Create a context for managing user-related state
const UserContext = createContext();

// UserProvider component to wrap the application and provide user-related state
export const UserProvider = ({ children }) => {
  // Define state variables for user-related data
  const [user, setUser] = useState("");
  const [paper, setPaper] = useState("");
  const [paperList, setPaperList] = useState([]);
  const [notes, setNotes] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        paper,
        setPaper,
        paperList,
        setPaperList,
        notes,
        setNotes,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
