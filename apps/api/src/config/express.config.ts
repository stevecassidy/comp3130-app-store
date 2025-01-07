//#region Import
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";

// Router
import { AuthenticationRouter } from "../routes/auth/auth.routes";
import { UserRouter } from "../routes/user/user.routes";
import { StudentRouter } from '../routes/student/student.routes';
import { AndroidAppRouter } from "../routes/androidApp/androidApp.routes";

import CronConfig from "./cron.config";

const { cronStart } = CronConfig();
//#endregion

//#region Configuration

// different asset dir for testing so we can clean it up
export const ASSET_DIR = process.env.NODE_ENV === 'test' ? './tests/assets' : './assets';
export const APK_DIR = `${ASSET_DIR}/apk`;
export const IMAGE_DIR = `${ASSET_DIR}/images`;

// Const variable
const App: Express = express();

// Compress Bundle
App.use(compression());

// Middle for protection in vulnerabilities
App.use(helmet());

// Use cors
App.use(cors());

// Parse incoming request with json payload
App.use(express.json());

// Get the json payload with Content-Type header
// Preventing to get undefined value in request
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

// serve static assets
App.use('/assets', express.static(ASSET_DIR));

// Run Cron
// cronStart();

//#endregion

//#region Routes Config

// For checking if the api is working
App.get("/", (req, res) => {
	res.status(200).send("Hello");
});

// Authentication
App.use("/api/auth", AuthenticationRouter);

// Users
App.use("/api/user", UserRouter);

// Student
App.use('/api/student', StudentRouter);

// AndroidApp
App.use('/api/app', AndroidAppRouter);

//#endregion

export default App;
