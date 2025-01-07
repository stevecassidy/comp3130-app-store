import {useEffect, useState} from "react";
import {getAndroidApp} from "../services/androidApps";
import {useParams} from "react-router-dom";
import {AndroidApp} from "@app-store/shared-types";
import {UploadAPK} from "./UploadAPK";
import {API_BASE_URL} from "../config";
import {UploadImage} from "./UploadImage";


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

  const iconURL = app.images?.find(img => img.role === 'icon')?.url;
  const screenshotURLs = app.images?.filter(img => img.role === 'screenshot')?.map(img => img.url);

  return (
    <div>
      <h1>{app.name}</h1>

      {iconURL && <img src={`${API_BASE_URL}${iconURL}`} width="100" height="100" alt="App Icon"/>}

      <p>Owner: {app.owner}</p>
      <p>Created: {app.dateCreated ? app.dateCreated.toLocaleString() : 'unknown'}</p>

      <p>Description: {app.description}</p>

      {app.apkFiles && app.apkFiles.map((apk) => (
        <div key={apk.url}>
          <a href={`${API_BASE_URL}${apk.url}`}>{apk.url}</a>
        </div>
      ))}

      {screenshotURLs && screenshotURLs.map((url: string, idx: number) => (
        <div key={`screenshot-${idx}`}>
          <img src={`${API_BASE_URL}${url}`} width="200"/>
        </div>
      ))}


      {appId && <UploadAPK appId={appId} />}

      {appId && <UploadImage appId={appId} role="icon" />}

      {appId && <UploadImage appId={appId} role="screenshot" />}


    </div>
  );
}