import {AndroidApp, AndroidAppDataSafety, CreateAndroidAppRequest, DataSafetyEntry, UpdateAndroidAppRequest} from "@app-store/shared-types";
import {useContext, useEffect, useState} from "react";
import {UserTokenContext} from "../contexts/userContext";
import {createAndroidApp, getAndroidApp, updateAndroidApp} from "../services/androidApps";
import {Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {UserToken} from "../services/users";
import {MarkdownEditor} from "./MarkdownEditor";


const appTemplate = {
  name: '',
  description: '',
  instructions: '',
  repoLink: '',
  dataSafety: {
    appActivity: {
      shared: false,
      information: '',
    },
    personalInformation: {
      shared: false,
      information: '',
    },
    location: {
      shared: false,
      information: '',
    },
    camera: {
      shared: false,
      information: '',
    },
    microphone: {
      shared: false,
      information: '',
    },
  }
};


export const CreateApp = () => {

  const appId = useParams().appId;
  const navigate = useNavigate();
  const {currentUser} = useContext(UserTokenContext);
  const [user, setUser] = useState<UserToken | null>(null);
  const [app, setApp] = useState<AndroidApp>(appTemplate);

  // a flag to differentiate between creating a new app and updating an existing one
  const updating = appId !== undefined;

  useEffect(() => {
    const getApp = async () => {
      if (appId) {
        const app = await getAndroidApp(appId);
        setApp(app);

        const user = currentUser();
        const isOwner = user && user.user.id === app?.owner?.id;
        if (!user) {
          navigate({pathname: '/login'});
        } else if (updating && !isOwner) {
          navigate({pathname: `/app/${appId}`});
        } else {
          setUser(user);
        }
      }
    };
    console.log('calling getApp()');
    getApp();
    
  }, [appId, updating, currentUser, navigate]);

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

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (user) {

      if (updating) {
        const newApp: UpdateAndroidAppRequest = {...app, id: appId, owner: user?.user.email};
        await updateAndroidApp(newApp);
        navigate({pathname: `/app/${appId}`});
      } else {
        const newApp = {...app, owner: user?.user.email};
        createAndroidApp(newApp).then((response) => {
          navigate({pathname: `/app/${response.id}`});
        });
      }
    }
  };

  return (
    <div>
      <h1>Create App</h1>          
      <Box
            component="form"
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
          <FormLabel htmlFor="repoLink">GitHub Link</FormLabel>
          <TextField 
            id="repoLink" 
            name="repoLink" 
            value={app.repoLink}                
            
            required
            fullWidth
            variant="outlined"
            onChange={updateApp('repoLink')} 
        />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <p>Describe your app for potential users.</p>
          <MarkdownEditor value={app.description} onChange={updateMarkdown('description')} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="reviewer">Reviewer Instructions</FormLabel>
          <p>Provide instructions for reviewers of your app including usernames and
            passwords if appropriate.
          </p>
          <MarkdownEditor value={app.instructions} onChange={updateMarkdown('instructions')} />
        </FormControl>

        <h2>Data Safety</h2>

        <p>You need to provide information about device capabilities used and data 
          collected by your app and why you need these.  This allows users to 
          understand why you are asking for permission to use these capabilities.
        </p>

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="personalInformation"
          label="Personal information about users."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="camera"
          label="App uses the device camera."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="microphone"
          label="App uses the device microphone."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="location"
          label="Data about user's location while using the app."
          />

        <p>You will be able to add screenshots etc. once the app has been created.</p>

        <div>
          <Button onClick={handleSubmit} variant="outlined">{updating ? "Update" : "Create"}</Button>
        </div>
      </Box>
    </div>
  )
}

interface DataSafetyEntryProps {
  property: keyof AndroidAppDataSafety;
  label: string;
  app: AndroidApp;
  setApp: (app: AndroidApp) => void;
}


const DataSafetyFormEntry = (props: DataSafetyEntryProps) => {

  const {app, setApp, property, label} = props;

  console.log('DataSafetyFormEntry', property, label);
  // event handler for checkbox 
  const updateDataSafetyShared = () => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setApp({
        ...app,
        dataSafety: {
          ...app.dataSafety,
          [property]: {
            ...app.dataSafety[property],
            shared: event.target.checked
          }
        }
      });
    };
  };
  
  const updateDataSafetyInfo = () => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setApp({
        ...app,
        dataSafety: {
          ...app.dataSafety,
          [property]: {
            ...app.dataSafety[property],
            information: event.target.value
          }
        }
      });
    };
  };

  return (
        <FormControl
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <FormControlLabel
          label={label}
          control={
          <Checkbox name="dataSafetyAppActivity"
            checked={app.dataSafety[property]?.shared || false} 
            onChange={updateDataSafetyShared()} />
          }
          />

            {app.dataSafety[property]?.shared &&
              <TextField
                fullWidth
                name="dataSafetyAppActivityInfo"
                value={app.dataSafety[property]?.information || ''} 
                onChange={updateDataSafetyInfo()} 
                placeholder="Provide an explanation about what data is collected and why."/>
            }
        </FormControl>
  )
}