import {AndroidApp} from "@app-store/shared-types";
import {getAndroidApps} from "../services/androidApps";
import {useEffect, useMemo, useState} from "react";
import {Box, Button, Card, CardActionArea, CardContent, CardHeader, CardMedia} from "@mui/material";
import {Link} from "react-router-dom";
import markdown from 'markdown-it';
import {API_BASE_URL} from "../config";
import {getCurrentUser} from "../services/users";

export const AppList = () => {
  const [apps, setApps] = useState<AndroidApp[]>([]);
  const [hasOwnApp, setHasOwnApp] = useState(false);

  const user = useMemo(() => getCurrentUser()?.user, []);
  
  console.log('hasOwnApp', hasOwnApp);
  
  useEffect(() => {
    const fetchApps = async () => {
      const apps = await getAndroidApps();
      setApps(apps);
      setHasOwnApp(apps.some((app) => app.owner?.id === user?.id));
      console.log('apps', apps);
    };
    fetchApps();
  }, [user]);


  return (
    <div>

    {!hasOwnApp &&
      <Button variant="outlined" color="primary">
          <Link to="/create">Create an App</Link>
      </Button>
    }

      <Box
      sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
      {apps && apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
      </Box>
    </div>
  );
}


const AppCard = ({app}: {app: AndroidApp}) => {
  
  const md = markdown();

  const headerImage = app.images ? app.images[0] : null;

  return (        
    <Card 
          variant="outlined"
          sx={{
            width: 300,
            height: 500,
          }}
          key={app.id}>
            {
              headerImage && <CardMedia sx={{height:150}} image={API_BASE_URL + headerImage.url} />
            }
            <CardActionArea 
                component={Link}
                to={`/app/${app.id}`}>
              <CardHeader title={app.name} />
            </CardActionArea>
              <CardContent>
                <dl>
                <dt>Owner</dt> <dd>{app.owner?.name}</dd>
                <dt>Created</dt> <dd>{app.dateCreated ? app.dateCreated.toLocaleString() : ''}</dd>
                </dl>
                <p dangerouslySetInnerHTML={{__html: md.render(app.description)}} />
              </CardContent>
        </Card>);
}