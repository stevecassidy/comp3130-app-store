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

export type UserTokenContextFns = {
  login: (token: UserToken) => void;
  logout: () => void;
  currentUser: () => UserToken | null;
};

export const UserTokenContext = createContext<UserTokenContextFns>({
  login: () => {},
  logout: () => {},
  currentUser: () => null,
});


