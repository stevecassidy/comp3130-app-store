// API Types - what gets sent over the wire
import {APIBase} from './base';


export interface AndroidApp extends APIBase {
  id: string;
  name: string;
  description: string;
  instructions: string;
  owner: string;
  apkFiles?: AndroidAppApk[];
  images?: AndroidAppImage[];
  dataSafety: AndroidAppDataSafety;
}

export interface DataSafetyEntry {
  shared: boolean;
  information: string;
}
export interface AndroidAppDataSafety {
  appActivity: DataSafetyEntry;
  personalInformation: DataSafetyEntry;
  location: DataSafetyEntry;
  appInfoPerformance: DataSafetyEntry;
  deviceInformation: DataSafetyEntry;
}


export interface AndroidAppApk extends APIBase {
  url: string;
}

export interface AndroidAppImage extends APIBase {
  url: string;
  role: string;
}

export interface CreateAndroidAppRequest extends APIBase {
  name: string;
  description: string;
  instructions: string;
  owner: string;
  dataSafety: AndroidAppDataSafety;
}

export interface UpdateAndroidAppRequest extends APIBase {
  id: string;
  name: string;
  description: string;
  instructions: string;
  owner: string;
}

export interface UploadAPKResponse {
  appID: string;
  url: string;
}

export interface UploadImageResponse {
  appID: string;
  url: string;
  role: string;
}


/**
 * Parse date strings in an API response into Date objects
 * @param data an object from the API but with string dates
 * @returns 
 */
export const objectToAndroidApp = (data: {dateUpdated: string, dateCreated: string}): AndroidApp => {
  return {
    ...data,
    dateUpdated: new Date(data.dateUpdated),
    dateCreated: new Date(data.dateCreated),
  } as AndroidApp;
};
