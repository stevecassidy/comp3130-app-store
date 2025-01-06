import {AndroidApp} from "@app-store/shared-types";
import {getAndroidApps} from "../services/androidApps";
import {useEffect, useState} from "react";
import {Button, Card, CardActionArea, CardContent, CardHeader} from "@mui/material";
import {Link} from "react-router-dom";

export const AppList = () => {
  const [apps, setApps] = useState<AndroidApp[]>([]);


  useEffect(() => {
    const fetchApps = async () => {
      const apps = await getAndroidApps();
      setApps(apps);
    };
    fetchApps();
  }, []);


  return (
    <div>
      <h1>App List</h1>

      <Button variant="outlined" color="primary">
          <Link to="/create">Create an App</Link>
      </Button>

      {apps && apps.map((app) => (
        <Card 
          variant="outlined"
          key={app.id}>
            <CardActionArea 
                component={Link}
                to={`/app/${app.id}`}>
              <CardHeader title={app.name} />
            </CardActionArea>
              <CardContent>
                <dl>
                <dt>Owner</dt> <dd>{app.owner}</dd>
                <dt>Created</dt> <dd>{app.dateCreated ? app.dateCreated.toLocaleString() : ''}</dd>
                </dl>
                <p>{app.description}</p>
              </CardContent>
        </Card>
      ))}
    </div>
  );
}