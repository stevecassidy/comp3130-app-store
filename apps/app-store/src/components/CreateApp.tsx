import {AndroidAppDataSafety, CreateAndroidAppRequest, DataSafetyEntry, UpdateAndroidAppRequest} from "@app-store/shared-types";
import {useContext, useEffect, useState} from "react";
import {UserTokenContext} from "../contexts/userContext";
import {createAndroidApp, getAndroidApp, updateAndroidApp} from "../services/androidApps";
import {Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {UserToken} from "../services/users";
import {MarkdownEditor} from "./MarkdownEditor";


const appTemplate = {
  name: '',
  description: 'Describe your app...',
  instructions: 'Instructions for reviewers...',
  owner: '',
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
    appInfoPerformance: {
      shared: false,
      information: '',
    },
    deviceInformation: {
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
  const [app, setApp] = useState<CreateAndroidAppRequest>(appTemplate);

  // a flag to differentiate between creating a new app and updating an existing one
  const updating = appId !== undefined;

  useEffect(() => {
    const getApp = async () => {
      if (appId) {
        const app = await getAndroidApp(appId);
        setApp(app);
      }
    };
    getApp();
    const user = currentUser();
    if (!user) {
      navigate({pathname: '/login'});
    } else {
      setUser(user);
    }
  }, [appId, currentUser, navigate]);

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
            onSubmit={handleSubmit}
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

        <p>You need to provide information about what, if any, data your app 
          collects from your users and how that data is used. Check all 
          questions below that apply to your app and provide explanatory text
          for your users in each case.</p>

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="appActivity"
          label="Data about how often users use the app and what they are doing."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="personalInformation"
          label="Personal information about users."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="location"
          label="Data about user's location while using the app."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="appInfoPerformance"
          label="Data about how the app is performing or error reports."
          />

        <DataSafetyFormEntry
          app={app}
          setApp={setApp}
          property="deviceInformation"
          label="Data about the device the user is using."
          />

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
  app: CreateAndroidAppRequest;
  setApp: (app: CreateAndroidAppRequest) => void;
}


const DataSafetyFormEntry = (props: DataSafetyEntryProps) => {

  const {app, setApp, property, label} = props;

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
            checked={app.dataSafety[property].shared} 
            onChange={updateDataSafetyShared()} />
          }
          />

            {app.dataSafety[property].shared &&
              <TextField
                fullWidth
                name="dataSafetyAppActivityInfo"
                value={app.dataSafety[property].information} 
                onChange={updateDataSafetyInfo()} 
                placeholder="Provide an explanation about what data is collected and why."/>
            }
        </FormControl>
  )
}