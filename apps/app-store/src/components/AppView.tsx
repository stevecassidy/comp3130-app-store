import {useEffect, useState} from "react";
import {getAndroidApp} from "../services/androidApps";
import {Link, useParams} from "react-router-dom";
import {AndroidApp, AndroidAppDataSafety, AppReview} from "@app-store/shared-types";
import {UploadAPK} from "./UploadAPK";
import {API_BASE_URL} from "../config";
import {UploadImage} from "./UploadImage";
import markdown from 'markdown-it';
import {Box, Button, FormControl, FormLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Rating, TextField} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SourceIcon from '@mui/icons-material/Source';
import EditIcon from '@mui/icons-material/Edit';
import {getCurrentUser} from "../services/users";
import {MarkdownEditor} from "./MarkdownEditor";

export const AppView = () => {
  const appId = useParams().appId;
  const [app, setApp] = useState<AndroidApp>();
  const md = markdown();

  const user = getCurrentUser()?.user;
  const isOwner = user && user.id === app?.owner.id;

  const updateApp = async (appId: string | undefined) => {
      if (appId) {
        const app = await getAndroidApp(appId);
        setApp(app);
      }
    };

  useEffect(() => {
    updateApp(appId);
  }, [appId])

  if (!app) {
    return <div>Loading...</div>;
  }

  const iconURL = app.images?.find(img => img.role === 'icon')?.url;
  const screenshotURLs = app.images?.filter(img => img.role === 'screenshot')?.map(img => img.url);

  return (
    <div>
      <h1>{app.name} 
        {isOwner && <Link to={`/edit/${appId}`}><EditIcon /></Link>}</h1>

      {iconURL && <img src={`${API_BASE_URL}${iconURL}`} width="100" height="100" alt="App Icon"/>}

      <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={"Owner: " + app.owner.name} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
           <ListItemButton>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary={"Created: " + (app.dateCreated ? app.dateCreated.toLocaleString() : 'unknown')} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
           <ListItemButton>
              <ListItemIcon>
                <SourceIcon />
              </ListItemIcon>
              <ListItemText primary={app.repoLink ? (<a href={app.repoLink}>GitHub</a>) : 'None'} />
            </ListItemButton>
          </ListItem>
          </List>
      {appId && <UploadAPK appId={appId} apkFile={app.apkFile} updateApp={updateApp} isOwner={isOwner} />}

      <h2>Description</h2>
      <p dangerouslySetInnerHTML={{__html: md.render(app.description)}} />

      {appId && <UploadImage images={screenshotURLs} appId={appId} role="screenshot" updateApp={updateApp} isOwner={isOwner} />}

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

    <ReviewForm app={app} isOwner={isOwner} />

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

interface ReviewProps {app: AndroidAp, isOwner: boolean};

export const ReviewForm = ({app, isOwner} : ReviewProps) => {

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const user = getCurrentUser();
  const md = markdown();


  const handleSubmit = async () => {
    const reviewData = {
      rating: rating,
      comment: comment,
    };
    const response = await fetch(`${API_BASE_URL}/api/app/${app.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`,
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    console.log(data);
  };


  if (isOwner ||  !user)
    return (
      <div>
        <h2>Reviews of {app.name}</h2>

      {app.reviews.map((review: AppReview, index: number) => (
          <Paper elevation={2} key={index} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f3ecb9' }}>
            <Rating name="rating" value={review.rating} readOnly />
            
            <p dangerouslySetInnerHTML={{__html: md.render(review.comment)}} />

          </Paper>
        ))}

      </div>
    )
  else 
  return (

    <Box            
      component="form"
      noValidate
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
      }}>
    <h2>Add your Review</h2>

      <FormControl>
        <FormLabel>Rating</FormLabel>
         <Rating name="rating" value={rating} onChange={(event, newValue) => {
          setRating(newValue);
        }} />
      </FormControl>

      <FormControl>
        <FormLabel>Your Review</FormLabel>
        <MarkdownEditor
        value={comment}
        onChange={(value) =>
          setComment(value)
        }
          />
      </FormControl>

      <div>
        <Button onClick={handleSubmit} variant="outlined">Submit Your Review</Button>
      </div>
    </Box>


  )

}