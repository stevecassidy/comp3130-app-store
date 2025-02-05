import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {useContext} from "react";
import {UserTokenContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';

export const NavBar = () => {

  const {logout, currentUser} = useContext(UserTokenContext);
  const navigate = useNavigate();

  const user = currentUser();

  const doLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          COMP3130 App Store
        </Typography>
        <IconButton color="inherit" href="/"><HomeIcon/></IconButton>
        {user ? (
          <>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            Welcome {user.user.name}
          </Typography>
          <Button onClick={doLogout} color="inherit">Logout</Button>
          </>
        ) :
        (<Button href="/login" color="inherit">Login</Button>)}
      </Toolbar>
    </AppBar>
  );
};
