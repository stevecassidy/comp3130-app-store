import {useContext} from "react";
import {AppList} from "../components/AppList";
import {UserTokenContext} from "../contexts/userContext";

export const Home = () => {
  const {currentUser} = useContext(UserTokenContext);

  const user = currentUser();

  if (!user) {
    return (<div>
      <p>Please login to view apps.</p>
    </div>);
  } else 
    return (<AppList />);
};

