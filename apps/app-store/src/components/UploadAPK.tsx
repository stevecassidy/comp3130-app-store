import {Box, Button, FormControl} from "@mui/material";
import {useState} from "react";
import {uploadAPK} from "../services/androidApps";
import {UploadAPKResponse} from "@app-store/shared-types";

export const UploadAPK = ({appId}: {appId: string}) => {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Uploading APK', appId);
    if (file)
      uploadAPK(appId, file).then((response: UploadAPKResponse) => {
        console.log('APK uploaded', response);
        setMessage("APK Successfully uploaded")
      });
  };

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Uploading APK', event.target.files);
    setFile(event.target.files?.[0] || null);
  };

  return (
    <div>
      <h1>Upload APK</h1>

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
            Select APK File 
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