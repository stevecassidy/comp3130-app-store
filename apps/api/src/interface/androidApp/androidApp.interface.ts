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
    owner: mongoose.Types.ObjectId; // id of the user who created the app
    dataSafety?: AndroidAppDataSafety;
    apkFile?: string;
    repoLink?: string;
    hasReviewed?: IAppReview[];
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


export interface IAppReview extends IBase {
    _id: mongoose.Types.ObjectId;
    appId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
}