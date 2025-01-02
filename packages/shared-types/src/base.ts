export interface APIBase {
	dateCreated?: Date;
	createdBy?: string;
	dateUpdated?: Date;
	updatedBy?: string;
}

/**
 * APIResponse type defines the response from all API
 * requests.  
 * 
 */
export interface APIResponse<T> {
  count: number; // number of data items
  success: boolean; // true if all is well
  data: T | null; // the response data
  statusCode: number; // response status code, eg. 200
  statusText: string; // response status message
}
