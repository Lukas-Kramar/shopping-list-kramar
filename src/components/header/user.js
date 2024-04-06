// import { useState, Utils } from "uu5g05";
import Dropdown from 'react-bootstrap/Dropdown';

import { createContext, useContext, useState } from "react";

export const USERS = [
  { id: "123", name: "James" },
  { id: "234", name: "Amelia" },
  { id: "345", name: "John" },
  { id: "456", name: "Chloe" }
];

// in pure react
const UserContext = createContext();
const useUserContext = () => useContext(UserContext);
// const [UserContext, useUserContext] = Utils.Context.create([]);

function UserProvider({ children }) {
  const userParams = useState(USERS[0]);

  return (
    <UserContext.Provider value={userParams}>
      {children}
    </UserContext.Provider>
  )
}

function UserSelector() {
  const [user, setUser] = useUserContext();

  return (
    <Dropdown>
      <Dropdown.Toggle variant="warning" id="dropdown-basic">
        {user.name} 
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {USERS.map(({ id, name }) => (
          <Dropdown.Item
            key={id}
            onClick={(e) => setUser(USERS.find((u) => u.id === id))}
            value={id}
          >
            {name}
          </Dropdown.Item>
        ))}
        
      </Dropdown.Menu>
    </Dropdown>
  );
}


function useUser() {
  return useUserContext()[0];
}



/*
* Usage:
* ------
* <UserProvider>
*   ...
*     <UserSelector />
*   ...
*     <SomeComponent />
* </UserProvider>
*
* function SomeComponent() {
*   const user = useUser();
*   return ...;
* }
* */

export { UserProvider, UserSelector, useUser };
