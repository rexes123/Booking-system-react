import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export const AuthContext = createContext();

//Provide context
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  console.log(user);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
    
      } else {
        setUser(null); 
        localStorage.removeItem('user');
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
