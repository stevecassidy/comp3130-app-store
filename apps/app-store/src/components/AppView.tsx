import {useEffect, useState} from "react";
import {getAndroidApp} from "../services/androidApps";
import {useParams} from "react-router-dom";
import {AndroidApp} from "@app-store/shared-types";
import {UploadAPK} from "./UploadAPK";
import {API_BASE_URL} from "../config";


export const AppView = () => {
  const appId = useParams().appId;
  const [app, setApp] = useState<AndroidApp>();

  useEffect(() => {
    const fetchApp = async () => {
      if (appId) {
        const app = await getAndroidApp(appId);
        setApp(app);
      }
    };
    fetchApp();
  }, [appId])

  if (!app) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{app.name}</h1>

      <p>Owner: {app.owner}</p>
      <p>Created: {app.dateCreated ? app.dateCreated.toLocaleString() : 'unknown'}</p>

      <p>Description: {app.description}</p>

      {app.apkFiles && app.apkFiles.map((apk) => (
        <div key={apk.url}>
          <a href={`${API_BASE_URL}${apk.url}`}>{apk.url}</a>
        </div>
      ))}


      {appId && <UploadAPK appId={appId} />}
    </div>
  );
}