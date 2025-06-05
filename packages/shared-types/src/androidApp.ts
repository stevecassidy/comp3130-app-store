// API Types - what gets sent over the wire
import {APIBase} from './base';

export interface UserSummaryDetails {
  id: string;
  name: string;
  email: string;
}

export interface AndroidAppReview extends APIBase {
  appId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface AndroidApp extends APIBase {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  owner?: UserSummaryDetails;
  instructions: string;
  apkFile?: AndroidAppApk;
  images?: AndroidAppImage[];
  dataSafety: AndroidAppDataSafety;
  repoLink?: string;
  reviews?: AndroidAppReview[];
  hasReviewed?: AndroidAppReview[];
}

export interface DataSafetyEntry {
  shared: boolean;
  information: string;
}
export interface AndroidAppDataSafety {
  personalInformation: DataSafetyEntry;
  location: DataSafetyEntry;
  camera: DataSafetyEntry;
  microphone: DataSafetyEntry;
}


export interface AndroidAppApk extends APIBase {
  url: string;
}

export interface AndroidAppImage extends APIBase {
  url: string;
  role: string;
  id: string;
}

export interface CreateAndroidAppRequest extends APIBase {
  name: string;
  description: string;
  instructions: string;
  owner: string;
  dataSafety: AndroidAppDataSafety;
  repoLink?: string;
}

export interface UpdateAndroidAppRequest extends APIBase {
  id: string;
  name: string;
  description: string;
  instructions: string;
  owner: string;
  dataSafety: AndroidAppDataSafety;
  repoLink?: string;
}

export interface AddReviewForAndroidAppRequest extends APIBase {
  appId: string;
  rating: number;
  comment: string;
}

export interface UploadAPKResponse {
  appId: string;
  url: string;
}

export interface UploadImageResponse {
  appId: string;
  url: string;
  role: string;
}

export interface DeleteImageResponse {
  appId: string;
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