import {useEffect, useReducer} from "react";
import {getCurrentUser, storeUser} from "../services/users";
import {userTokenReducer, UserTokenContext, UserDispatchContext} from "./userContext";


export const UserContextProvider = (props: {children: React.ReactNode;}) => {
  const [user, dispatch] = useReducer(userTokenReducer, undefined, getCurrentUser);

  useEffect(() => {
    try {
      storeUser(user);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [user]);

  return (
    <UserTokenContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {props.children}
      </UserDispatchContext.Provider>
    </UserTokenContext.Provider>
  );
};
