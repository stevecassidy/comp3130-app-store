import {useContext} from "react";
import {AppList} from "../components/AppList";
import {UserTokenContext} from "../contexts/userContext";
import {getCurrentUser} from "../services/users";

export const Home = () => {
  const {currentUser} = useContext(UserTokenContext);

  const user = getCurrentUser();

  if (!user) {
    return (<div>
      <p>Please login to view apps.</p>
    </div>);
  } else 
    return (<AppList />);
};

