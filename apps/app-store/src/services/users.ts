
export interface User {
  name: string;
  email: string;
}

export interface UserToken {
  token: string;
  accessToken: string;
  user: User;
}

const USER_KEY = 'usertoken';


/**
 * Store the user token, updating the currently logged in user
 * 
 * @param userToken - user token as returned by the API on login
 */
export const storeUser = (userToken: UserToken) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userToken));
};


/**
 * Get the current user if logged in or null if not
 * 
 * @returns User or null
 */
export const getCurrentUser = () => {
  const userToken = localStorage.getItem(USER_KEY);
  if (userToken) {
    return JSON.parse(userToken.user);
  }
  return null;
};


