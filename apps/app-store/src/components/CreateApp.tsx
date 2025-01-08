import {CreateAndroidAppRequest} from "@app-store/shared-types";
import {useContext, useEffect, useState} from "react";
import {UserTokenContext} from "../contexts/userContext";
import {createAndroidApp} from "../services/androidApps";
import {Box, FormControl, FormLabel, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {UserToken} from "../services/users";
import {MarkdownEditor} from "./MarkdownEditor";


export const CreateApp = () => {

  const navigate = useNavigate();
  const {currentUser} = useContext(UserTokenContext);
  const [user, setUser] = useState<UserToken | null>(null);
  const [app, setApp] = useState<CreateAndroidAppRequest>({
    name: '',
    description: 'Describe your app... __bold__ *italic*',
    owner: '',
  });

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      navigate({pathname: '/login'});
    } else {
      setUser(user);
    }
  }, [currentUser, navigate]);


  const updateApp = (property: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setApp({...app, [property]: event.target.value});
    }
  };

  const updateMarkdown = (property: string) => {
    return (value: string) => {
      setApp({...app, [property]: value});
    }
  };

  const createApp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      const newApp = {...app, owner: user?.user.email};
      console.log('Creating app', newApp);
      createAndroidApp(newApp).then(() => {
        console.log('App created, navigating to home');
        navigate({pathname: '/'});
      });
    }
  };

  return (
    <div>
      <h1>Create App</h1>          
      <Box
            component="form"
            onSubmit={createApp}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
        <FormControl>
          <FormLabel htmlFor="name">App Name</FormLabel>
          <TextField 
            id="name" 
            name="name" 
            value={app.name}                
            
            required
            fullWidth
            variant="outlined"
            onChange={updateApp('name')} 
        />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>

          <MarkdownEditor value={app.description} onChange={updateMarkdown('description')} />

        </FormControl>
        <div>
          <input type="submit" value="Create" />
        </div>
      </Box>
    </div>
  )
}