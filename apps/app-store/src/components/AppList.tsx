import {AndroidApp} from "@app-store/shared-types";
import {getAndroidApps} from "../services/androidApps";
import {useEffect, useState} from "react";

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

      {apps && apps.map((app) => (
        <div key={app.id}>
          <h2>{app.name}</h2>
          <p>{app.description}</p>
        </div>
      ))}
    </div>
  );
}