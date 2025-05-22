import {Alert, Box, Button, FormControl} from "@mui/material";
import {useState} from "react";
import {uploadAPK} from "../services/androidApps";
import {AndroidAppApk} from "@app-store/shared-types";
import {API_BASE_URL} from "../config";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export const UploadAPK = ({appId, apkFile, updateApp, isOwner}:
  {
    appId: string, 
    apkFile: AndroidAppApk | undefined, 
    updateApp: (appId: string | undefined) => void,
    isOwner: boolean,
  }) => {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file)
      uploadAPK(appId, file).then(() => {
        updateApp(appId);
        setFile(null);
        setMessage("APK Successfully uploaded")
      });
  };

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };
  /* if user is the owner show an upload form */

  return (
    <>
      {message && <Alert onClose={() => {setMessage('')}}>{message}</Alert>}
      <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              gap: 2,
            }}
          >
          {apkFile &&
              <Button
                aria-label='APK Download'
                size="large"
                href={`${API_BASE_URL}${apkFile}`}
                download="app.apk"
                startIcon={<PhoneAndroidIcon />}
                >
                Download APK  
                </Button>
          }
          {isOwner && (<>
            {!file && 
              <FormControl>
                <Button variant="contained" component="label">
                  {apkFile ? "Update APK File" : "Select APK File"}
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
            </>)
          }
      </Box>
    </>
  );

}