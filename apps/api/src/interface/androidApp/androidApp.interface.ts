//#region Import
import mongoose from "mongoose";
import { IBase } from "../base.interface";
//#endregion

// Model
interface IAndroidApp extends IBase {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    owner: string; // email address of User
}

// An APK file associated with the app, there may be more than one version
interface IAndroidAppApk extends IBase {
    _id: mongoose.Types.ObjectId;
    appId: mongoose.Types.ObjectId;
    filename: string;
}

// Request

interface IUpdateAndroidAppRequest {
    _id: string;
    name: string;
    description: string;
    owner: string;
}

export type { IAndroidApp, IAndroidAppApk };
