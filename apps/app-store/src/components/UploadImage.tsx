import {Box, Button, FormControl} from "@mui/material";
import {useState} from "react";
import {uploadImage} from "../services/androidApps";
import {UploadImageResponse} from "@app-store/shared-types";

export const UploadImage = ({appId, role}: {appId: string, role: string}) => {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Uploading Image', appId);
    if (file)
      uploadImage(appId, role, file).then((response: UploadImageResponse) => {
        setMessage("Image Successfully uploaded")
      });
  };

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  return (
    <div>
      <h1>Upload {role.toUpperCase()} Image</h1>

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
            <FormControl>
            <Button variant="contained" component="label">
            Select Image File 
            {file && <span>:{file.name}</span>}
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
            {message && <p>{message}</p>}
            <FormControl>
              <Button type="submit" variant="contained">Upload</Button>
            </FormControl>
      </Box>
    </div>

  );

}