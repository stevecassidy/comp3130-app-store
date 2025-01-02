// API Types - what gets sent over the wire
import {APIBase} from './base';


export interface AndroidApp extends APIBase {
  id: string;
  name: string;
  description: string;
  owner: string;
}

export interface AndroidAppApk extends APIBase {
  id: string;
  appId: string;
  filename: string;
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

