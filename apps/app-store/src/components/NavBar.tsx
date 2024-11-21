import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {useContext} from "react";
import {UserDispatchContext, UserTokenContext} from "../contexts/userContext";

export const NavBar = () => {

  const userToken = useContext(UserTokenContext);
  const userDispatch = useContext(UserDispatchContext);

  const logout = () => {
    if (userDispatch) userDispatch({type: 'LOGOUT', payload: null});
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          COMP3130 App Store
        </Typography>
        {userToken ? (
          <>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            Welcome {userToken.user.name}
          </Typography>
          <Button onClick={logout} color="inherit">Logout</Button>
          </>
        ) :
        (<Button href="/login" color="inherit">Login</Button>)}
      </Toolbar>
    </AppBar>
  );
};
