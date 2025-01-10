//#region Import
import mongoose from "mongoose";
import { IBase } from "../base.interface";
import {AndroidAppDataSafety} from "@app-store/shared-types";
//#endregion

// Model
export interface IAndroidApp extends IBase {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    instructions: string;
    owner: string; // email address of User
    dataSafety?: AndroidAppDataSafety;
    apkFiles?: mongoose.Types.ObjectId[];
}

// An APK file associated with the app, there may be more than one version
export interface IAndroidAppApk extends IBase {
    _id: mongoose.Types.ObjectId;
    appId: mongoose.Types.ObjectId;
    filename: string;
}

// Request

export interface IUpdateAndroidAppRequest {
    _id: string;
    name: string;
    description: string;
    owner: string;
}

// images associated with the app, screenshots, app icon

export interface IAndroidAppImage extends IBase {
    _id: mongoose.Types.ObjectId;
    appId: mongoose.Types.ObjectId;
    role: string;
    filename: string;
}


