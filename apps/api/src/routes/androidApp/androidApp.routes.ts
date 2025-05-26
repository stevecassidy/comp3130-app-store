//#region Import
import { Router } from "express";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import {
  GetAndroidApp, 
  GetAndroidApps,
  CreateAndroidApp, 
  UpdateAndroidApp, 
  DeleteAndroidApp, 
  AddAPKForAndroidApp,
  AddImageForAndroidApp,
  AddReviewForAndroidApp,
  DeleteImageForAndroidApp} from "../../controller/androidApp/androidApp.controller";

import multer from "multer";
//#endregion

const UPLOAD_DIR = './uploads';

const upload = multer({dest: UPLOAD_DIR});

//#region Action
const AndroidAppRouter = Router()
AndroidAppRouter.use(AuthMiddleware)

AndroidAppRouter.get('/:id', GetAndroidApp)
AndroidAppRouter.get('/', GetAndroidApps)
AndroidAppRouter.post('/', CreateAndroidApp)
AndroidAppRouter.put('/:id', UpdateAndroidApp)
AndroidAppRouter.delete('/:id', DeleteAndroidApp)

AndroidAppRouter.post('/:id/apk', upload.single('apk'), AddAPKForAndroidApp)
AndroidAppRouter.post('/:id/image', upload.single('image'), AddImageForAndroidApp)
AndroidAppRouter.delete('/:id/image/:imageID', DeleteImageForAndroidApp)
AndroidAppRouter.post('/:id/review', AddReviewForAndroidApp);


//#endregion

export { AndroidAppRouter }