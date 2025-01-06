import {useEffect, useReducer} from "react";
import {getCurrentUser, storeUser, UserToken} from "../services/users";
import {userTokenReducer, UserTokenContext} from "./userContext";


export const UserContextProvider = (props: {children: React.ReactNode;}) => {
  const [user, dispatch] = useReducer(userTokenReducer, undefined, getCurrentUser);

  useEffect(() => {
    try {
      storeUser(user);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [user]);


  const login = (token: UserToken) => {
    storeUser(token);
    dispatch({type: 'LOGIN', payload: token});
  };

  const logout = () => {
    storeUser(null);
    dispatch({type: 'LOGOUT', payload: null});
  };

  const currentUser = () => {
    return getCurrentUser();
  };

  return (
    <UserTokenContext.Provider value={{login, logout, currentUser}}>
        {props.children}
    </UserTokenContext.Provider>
  );
};
