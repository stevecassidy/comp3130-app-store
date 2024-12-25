//#region Import
import { Router } from "express";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import {
  GetAndroidApp, 
  GetAndroidApps,
  CreateAndroidApp, 
  UpdateAndroidApp, 
  DeleteAndroidApp, 
  AddAPKForAndroidApp} from "../../controller/androidApp/androidApp.controller";

import multer from "multer";
//#endregion

const UPLOAD_DIR = './uploads';

const upload = multer({dest: UPLOAD_DIR});

//#region Action
const AndroidAppRouter = Router()
AndroidAppRouter.use(AuthMiddleware)
AndroidAppRouter.get('/:id', GetAndroidApp)
AndroidAppRouter.get('/:searchKey/:pageNumber', GetAndroidApps)
AndroidAppRouter.post('/', CreateAndroidApp)
AndroidAppRouter.put('/:id', UpdateAndroidApp)
AndroidAppRouter.delete('/:id', DeleteAndroidApp)

AndroidAppRouter.post('/:id/apk', upload.single('apk'), AddAPKForAndroidApp)
// AndroidAppRouter.get('/:id/apk', GetAPKListForAndroidApp)
// AndroidAppRouter.get('/:id/apk/:apiId', GetAPKForAndroidApp)

// AndroidAppRouter.post('/:id/screenshot', AddScreenshotForAndroidApp)
// AndroidAppRouter.get('/:id/apk', GetScreenshotListForAndroidApp)
// AndroidAppRouter.get('/:id/apk/:screenshotId', GetScreenshotForAndroidApp)


//#endregion

export { AndroidAppRouter }