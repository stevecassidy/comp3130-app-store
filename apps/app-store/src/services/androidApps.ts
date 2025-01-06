
import {AndroidApp, CreateAndroidAppRequest, objectToAndroidApp, UpdateAndroidAppRequest, UploadAPKResponse} from '@app-store/shared-types';
import {API_BASE_URL} from '../config';
import {getCurrentUser} from './users';

export const getAndroidApps = async (): Promise<AndroidApp[]> => {
  const url = `${API_BASE_URL}/api/app/_/1`;
  const user = getCurrentUser();
  console.log(user);
  if (user) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    if (data.count > 0) {
      return data.data.map(objectToAndroidApp);
    } else {
      return [];
    }
  } else {
    throw new Error('User not logged in');
  }
};

export const getAndroidApp = async (id: string): Promise<AndroidApp> => {
  const url = `${API_BASE_URL}/api/app/${id}`;
  const token = getCurrentUser()?.token;
  if (token) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return objectToAndroidApp(data.data);
  } else {
    throw new Error('User not logged in');
  }
};

export const createAndroidApp = async (
  androidApp: CreateAndroidAppRequest
): Promise<AndroidApp> => {
  const url = `${API_BASE_URL}/api/app`;
  const token = getCurrentUser()?.token;
  if (token) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(androidApp),
    });
    const data = await response.json();
    return objectToAndroidApp(data.data);
  } else {
    throw new Error('User not logged in');
  }
};

export const updateAndroidApp = async (
  id: string,
  androidApp: UpdateAndroidAppRequest
): Promise<AndroidApp> => {
  const url = `${API_BASE_URL}/api/app/${id}`;
  const token = getCurrentUser()?.token;
  if (token) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(androidApp),
    });
    const data = await response.json();
    return objectToAndroidApp(data.data);
  } else {
    throw new Error('User not logged in');
  }
};

export const deleteAndroidApp = async (id: string): Promise<void> => {
  const url = `${API_BASE_URL}/api/app/${id}`;
  const token = getCurrentUser()?.token;
  if (token) {
    await fetch(url, {
      method: 'DELETE',
    });
  } else {
    throw new Error('User not logged in');
  }
};


export const uploadAPK = async (id: string, apkFile: File): Promise<UploadAPKResponse> => {
  const url = `${API_BASE_URL}/api/app/${id}/apk`;
  const token = getCurrentUser()?.token;
  if (token) {
    const formData = new FormData();
    formData.append('apk', apkFile);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data.data;
  } else {
    throw new Error('User not logged in');
  }
};

