// API Types - what gets sent over the wire
import {APIBase} from './base';


export interface AndroidApp extends APIBase {
  id: string;
  name: string;
  description: string;
  owner: string;
  apkFiles?: AndroidAppApk[];
  images?: AndroidAppImage[];
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
  owner: string;
}

export interface UpdateAndroidAppRequest extends APIBase {
  id: string;
  name: string;
  description: string;
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
