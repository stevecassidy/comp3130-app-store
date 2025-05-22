
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserToken {
  token: string;
  user: User;
}

const USER_KEY = 'usertoken';

/**
 * Store the user token, updating the currently logged in user
 * 
 * @param userToken - user token as returned by the API on login
 */
export const storeUser = (userToken: UserToken | null) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userToken));
};

/**
 * Decode a JWT token and return the payload
 * @param t - token string (jwt)
 * @returns 
 */
function jwtDecode(t: string) {
  return JSON.parse(window.atob(t.split('.')[1]));
}
/**
 * Get the current user if logged in or null if not
 * check the expiry of the JWT token and remove it if expired
 * 
 * @returns User or null
 */
export const getCurrentUser = () => {
  const userToken = localStorage.getItem(USER_KEY);
  if (userToken) {
    const user = JSON.parse(userToken) as UserToken;
    if (user) {
      const parsedToken = jwtDecode(user.token);
      const expire = new Date(parsedToken.exp);
      if (expire > new Date()) {
        localStorage.removeItem(USER_KEY);
        return null;
      }
      return user;
    }
  }
  return null;
};


