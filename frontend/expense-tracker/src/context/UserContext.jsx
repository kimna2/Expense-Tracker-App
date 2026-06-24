import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // [SIMPLIFY] updateUser and clearUser are trivial wrappers around setUser.
  // Either expose setUser directly, or at minimum wrap in useCallback to stabilize references.
  // Without useCallback, these create new function references every render, which causes
  // infinite re-renders in useUserAuth hook (it has them in its useEffect dependency array).
  // Fix:
  //   const updateUser = useCallback((userData) => setUser(userData), []);
  //   const clearUser = useCallback(() => setUser(null), []);

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
