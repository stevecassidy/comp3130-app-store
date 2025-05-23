import {useContext} from "react";
import {AppList} from "../components/AppList";
import {UserTokenContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";

export const Home = () => {
  const {currentUser} = useContext(UserTokenContext);

  const navigate = useNavigate();
  const user = currentUser();

  if (!user) {
    navigate('/login');
  } else 
    return (<AppList />);
};

