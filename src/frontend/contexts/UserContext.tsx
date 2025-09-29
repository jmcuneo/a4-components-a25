import { createContext, useEffect, useState } from 'react';

import { getUser } from '@/services/userService'

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

export const UserContext = createContext<UserContextType>({user: null, setUser: () => {}});

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

    useEffect(() => {
        getUser().then((data) => {
            setUser(data) // Set user even if its null
        })
    }, []);

  return(
    <UserContext value={{user, setUser}}>
        {children}
    </UserContext>
  );
};
