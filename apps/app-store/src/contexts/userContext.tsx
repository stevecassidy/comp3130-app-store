import {createContext} from "react";
import {UserToken} from "../services/users";

type UserAction = {
  type: 'LOGIN' | 'LOGOUT';
  payload: UserToken | null;
};

export const userTokenReducer = (state: UserToken | null, action: UserAction) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export const UserTokenContext = createContext<UserToken | null>(null);
export const UserDispatchContext = createContext<React.Dispatch<UserAction> | null>(null);
