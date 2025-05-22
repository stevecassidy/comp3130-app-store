import {Alert, Box, Button, FormControl, ImageList, ImageListItem} from "@mui/material";
import {useState} from "react";
import {uploadImage} from "../services/androidApps";
import {API_BASE_URL} from "../config";

export const UploadImage = ({appId, images, role, updateApp, isOwner}: 
    {
      appId: string, 
      images: string[] | undefined, 
      role: string, 
      updateApp: (appId: string | undefined) => void,
      isOwner: boolean,
    }) => {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const niceRoleName = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Uploading Image', appId);
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

  return (
    <div>
      <h1>Upload {niceRoleName} Image</h1>

      {images && 
        <ImageList sx={{ width: '100%', height: 450 }} cols={5} rowHeight={164}>
          {images.map((url: string, idx: number) => (
            <ImageListItem key={`screenshot-${idx}`}>
              <img src={`${API_BASE_URL}${url}`} width="200"/>
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