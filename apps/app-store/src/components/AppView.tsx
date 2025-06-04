import {AndroidApp, AndroidAppDataSafety, AndroidAppReview} from "@app-store/shared-types";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SourceIcon from '@mui/icons-material/Source';
import {Box, Button, FormControl, FormLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Rating} from "@mui/material";
import markdown from 'markdown-it';
import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {API_BASE_URL} from "../config";
import {getAndroidApp} from "../services/androidApps";
import {getCurrentUser} from "../services/users";
import {MarkdownEditor} from "./MarkdownEditor";
import {UploadAPK} from "./UploadAPK";
import {UploadImage} from "./UploadImage";
import BadgeIcon from '@mui/icons-material/Badge';

export const AppView = () => {
  const appId = useParams().appId;
  const [app, setApp] = useState<AndroidApp>();
  const md = markdown();

  const user = getCurrentUser()?.user;
  const isOwner = user ? user.id === app?.owner?.id : false;

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
              <ListItemText primary={"Owner: " + app.owner?.name} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary={"Slug: " + app.slug} />
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

      {app.images && appId && <UploadImage images={app.images} appId={appId} role="screenshot" updateApp={updateApp} isOwner={isOwner} />}

      <h2>Reviewer Information</h2>

      <p dangerouslySetInnerHTML={{__html: md.render(app.instructions)}} />

      <h2>App Capabilities and Data Collection</h2>

      <p>Here's more information that the developer has provided about
        the kinds of data that this app may collect and share, and device capabilities
        that the app will use.</p>

        <DataSafety
          app={app}
          property="personalInformation"
          label="Personal information about users."
          />

       <DataSafety
          app={app}
          property="camera"
          label="App uses the device camera."
          />
        <DataSafety
          app={app}
          property="microphone"
          label="App uses the device microphone."
          />
        <DataSafety
          app={app}
          property="location"
          label="Data about user's location while using the app."
          />

    <ReviewForm app={app} isOwner={isOwner || user?.role === 'admin'} updateApp={updateApp} />

    </div>
  );
}


interface DSProps {
  app: AndroidApp,
  property: keyof AndroidAppDataSafety, 
  label: string
};

const DataSafety = ({app, property, label}: DSProps) => {

  if (app?.dataSafety[property]?.shared)
    return (
      <div>
        <h3>{label}</h3>
        <p>{app?.dataSafety[property].information}</p>
      </div>
    )
    else return <></>;
}

interface ReviewProps {app: AndroidApp, isOwner: boolean, updateApp: (appId: string | undefined) => Promise<void>};

export const ReviewForm = ({app, isOwner, updateApp} : ReviewProps) => {

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const user = getCurrentUser();
  const md = markdown();

  const handleSubmit = async () => {
    const reviewData = {
      rating: rating,
      comment: comment,
    };
    await fetch(`${API_BASE_URL}/api/app/${app.id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`,
      },
      body: JSON.stringify(reviewData),
    });
    updateApp(app.id);
  };

  // Check if the user has already reviewed the app
  const ourReview = app.reviews?.find(review => review.userId === user?.user.id);

  if (isOwner ||  !user)
    return (
      <div>

  {/* should only be present for the admin user */}
  {app.hasReviewed?.length &&
     (
      <div>
        <h2>Reviews by {app.owner?.name}</h2>
        {app.hasReviewed.map((review: AndroidAppReview, index: number) => (
          <Paper elevation={2} key={index} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f5ead1' }}>
            <Rating name="rating" value={review.rating} readOnly />

            <p dangerouslySetInnerHTML={{__html: md.render(review.comment)}} />
          </Paper>
        ))
      }
      </div>
    )}
        <h2>Reviews of {app.name}</h2>

      {app.reviews && app.reviews.map((review: AndroidAppReview, index: number) => (
          <Paper elevation={2} key={index} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f3ecb9' }}>
            <Rating name="rating" value={review.rating} readOnly />
            
            <p dangerouslySetInnerHTML={{__html: md.render(review.comment)}} />

          </Paper>
        ))}

  
    </div>
    )
  else if (ourReview)
    return (
     <>
     <h2>Your Review</h2>
        <Paper elevation={2} sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f3ecb9' }}>
          <Rating name="rating" value={ourReview.rating} readOnly />
          
          <p dangerouslySetInnerHTML={{__html: md.render(ourReview.comment)}} />

        </Paper>
    </>
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
         <Rating name="rating" value={rating} onChange={(_event, newValue) => {
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