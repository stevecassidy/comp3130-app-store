
import {AndroidApp, CreateAndroidAppRequest, DeleteImageResponse, objectToAndroidApp, UpdateAndroidAppRequest, UploadAPKResponse, UploadImageResponse} from '@app-store/shared-types';
import {API_BASE_URL} from '../config';
import {getCurrentUser} from './users';

export const getAndroidApps = async (): Promise<AndroidApp[]> => {
  const url = `${API_BASE_URL}/api/app/`;
  const user = getCurrentUser();
  if (user) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    return data.data.map(objectToAndroidApp);
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
    if (data.success)
      return objectToAndroidApp(data.data);
    else {
      throw new Error(data.statusText);
    }
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
    if (response.status === 201) {
      const data = await response.json();
      return objectToAndroidApp(data.data);
    } else {
      throw new Error(response.statusText);
    }
  } else {
    throw new Error('User not logged in');
  }
};

export const updateAndroidApp = async (
  androidApp: UpdateAndroidAppRequest
): Promise<AndroidApp> => {
  const url = `${API_BASE_URL}/api/app/${androidApp.id}`;
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
    if (response.status === 200) {
      const data = await response.json();
      return objectToAndroidApp(data.data);
    } else {
      throw new Error(response.statusText);
    }
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
    console.log(data);
    return data.data as UploadAPKResponse;
  } else {
    throw new Error('User not logged in');
  }
};


export const uploadImage = async (id: string, role: string, imageFile: File): Promise<UploadImageResponse> => {
  const url = `${API_BASE_URL}/api/app/${id}/image`;
  const token = getCurrentUser()?.token;
  if (token) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.set('role', role);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data.data as UploadImageResponse;
  } else {
    throw new Error('User not logged in');
  }
};



export const deleteImage = async (appId: string, imageId: string): Promise<DeleteImageResponse> => {
  const url = `${API_BASE_URL}/api/app/${appId}/image/${imageId}`;
  const token = getCurrentUser()?.token;
  console.log('deleting image', appId, imageId);
  if (token) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await response.json();
    return data.data as DeleteImageResponse;
  } else {
    throw new Error('User not logged in');
  }
};
