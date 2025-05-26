import {Alert, Box, Button, FormControl, IconButton, ImageList, ImageListItem, ImageListItemBar} from "@mui/material";
import {useState} from "react";
import {deleteImage, uploadImage} from "../services/androidApps";
import {API_BASE_URL} from "../config";
import DeleteIcon from '@mui/icons-material/Delete';
import {AndroidAppImage} from "@app-store/shared-types";


export const UploadImage = ({appId, images, role, updateApp, isOwner}: 
    {
      appId: string, 
      images: AndroidAppImage[],
      role: string, 
      updateApp: (appId: string | undefined) => void,
      isOwner: boolean,
    }) => {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const niceRoleName = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file)
      uploadImage(appId, role, file).then(() => {
        updateApp(appId);
        setMessage("Image Successfully uploaded")
      });
      setFile(null);
  };

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleDeleteImage = (imageId: string) => async () => {
    deleteImage(appId, imageId).then(() => {
      updateApp(appId);
    });
  };

  return (
    <div>
      <h1>Upload {niceRoleName} Image</h1>

      {images && 
        <ImageList sx={{ width: '100%', height: 450 }} cols={5} rowHeight={164}>
          {images.map((image: AndroidAppImage, idx: number) => (
            <ImageListItem key={`screenshot-${idx}`}>
              <img src={`${API_BASE_URL}${image.url}`} width="200"/>
              {isOwner && 
              <ImageListItemBar
                position="below"
                title={`Screenshot ${idx + 1}`}
                actionIcon={
                  <IconButton
                    sx={{ backgroundColor: 'rgba(239, 99, 99, 0.54)' }}
                    aria-label={`Delete this image`}
                    onClick={handleDeleteImage(image.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
              }>
              </ImageListItemBar>
            }
            </ImageListItem>
          ))}
        </ImageList>
      }
      
      {message && <Alert onClose={() => {setMessage('')}}>{message}</Alert>}

      {isOwner && (
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
            <p>The first screenshot you upload will be used as the app image on the main page.</p>
            {!file && <FormControl>
            <Button variant="contained" component="label">
            Add {niceRoleName} File
              <input
                  hidden
                  id="apk-file-input"
                  multiple
                  type="file"
                  name="apk"
                  onChange={updateFile}
                  />
                </Button>
            </FormControl>
            }
            {file && 
              <FormControl>
                <Button type="submit" variant="contained">Upload {file.name}</Button>
              </FormControl>
            }
      </Box>
    )}
    </div>

  );

}