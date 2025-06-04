import {useContext} from "react";
import {UserTokenContext} from "../contexts/userContext";
import {useNavigate} from "react-router-dom";
import {AdminAppList} from "../components/AdminAppList";

export const AdminView = () => {
  const {currentUser} = useContext(UserTokenContext);

  const navigate = useNavigate();
  const user = currentUser();

  if (!user) {
    navigate('/login');
  } else 
    return (<AdminAppList />);
};

