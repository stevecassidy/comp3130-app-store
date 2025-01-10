import {useEffect, useState} from "react";
import {getAndroidApp} from "../services/androidApps";
import {Link, useParams} from "react-router-dom";
import {AndroidApp, AndroidAppDataSafety} from "@app-store/shared-types";
import {UploadAPK} from "./UploadAPK";
import {API_BASE_URL} from "../config";
import {UploadImage} from "./UploadImage";
import markdown from 'markdown-it';


export const AppView = () => {
  const appId = useParams().appId;
  const [app, setApp] = useState<AndroidApp>();
  const md = markdown();

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

      <Link to={`/edit/${appId}`}>Edit</Link>


      {iconURL && <img src={`${API_BASE_URL}${iconURL}`} width="100" height="100" alt="App Icon"/>}

      <p>Owner: {app.owner}</p>
      <p>Created: {app.dateCreated ? app.dateCreated.toLocaleString() : 'unknown'}</p>

      <h2>Description</h2>
      <p dangerouslySetInnerHTML={{__html: md.render(app.description)}} />

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

      <h2>Reviewer Information</h2>

      {app.instructions}

      <h2>Data Safety</h2>

      <p>Here's more information that the developer has provided about
        the kinds of data that this app may collect and share, and
        security practices that the app may follow.</p>

      <DataSafety
          app={app}
          property="appActivity"
          label="Data about how often users use the app and what they are doing."
          />

        <DataSafety
          app={app}
          property="personalInformation"
          label="Personal information about users."
          />

        <DataSafety
          app={app}
          property="location"
          label="Data about user's location while using the app."
          />

        <DataSafety
          app={app}
          property="appInfoPerformance"
          label="Data about how the app is performing or error reports."
          />

        <DataSafety
          app={app}
          property="deviceInformation"
          label="Data about the device the user is using."
          />



      {appId && <UploadAPK appId={appId} />}

      {appId && <UploadImage appId={appId} role="icon" />}

      {appId && <UploadImage appId={appId} role="screenshot" />}


    </div>
  );
}


interface DSProps {app: AndroidApp, property: keyof AndroidAppDataSafety, label: string};

const DataSafety = ({app, property, label}: DSProps) => {

  if (app?.dataSafety[property].shared)
    return (
      <div>
        <h3>{label}</h3>
        <p>{app?.dataSafety[property].information}</p>
      </div>
    )
    else return <></>;
}