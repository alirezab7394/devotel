import api from '../api/axios';
import { DynamicFormConfig } from '@/types/form';

// Example API service functions

/**
 * Fetch data from the API
 * @param endpoint - The API endpoint to fetch from
 * @returns The response data
 */
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  const response = await api.get<T>(endpoint);
  return response.data;
};

/**
 * Fetch form configurations from the API
 * @returns The form configurations data
 */
export const fetchFormConfigurations = async (): Promise<DynamicFormConfig[]> => {
  return fetchData<DynamicFormConfig[]>('api/insurance/forms');
};

/**
 * Fetch form submissions with dynamic columns
 * @returns The submissions data with columns and data
 */
export interface FormSubmissionsResponse {
  columns: string[];
  data: Array<{
    id: string;
    [key: string]: string | number;
  }>;
}

export const fetchFormSubmissions = async (): Promise<FormSubmissionsResponse> => {
  return fetchData<FormSubmissionsResponse>('api/insurance/forms/submissions');
};

/**
 * Submit form data to the API
 * @param formId - The ID of the form being submitted
 * @param formData - The form data to submit
 * @returns The response data with submission ID
 */
export const submitFormToApi = async (formId: string, formData: any): Promise<{id: string}> => {
  return postData<{formId: string, data: any}, {id: string}>(
    'api/insurance/forms/submit', 
    { formId, data: formData }
  );
};

/**
 * Post data to the API
 * @param endpoint - The API endpoint to post to
 * @param data - The data to post
 * @returns The response data
 */
export const postData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  const response = await api.post<R>(endpoint, data);
  return response.data;
};

/**
 * Update data in the API
 * @param endpoint - The API endpoint to update
 * @param data - The data to update
 * @returns The response data
 */
export const updateData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  const response = await api.put<R>(endpoint, data);
  return response.data;
};

/**
 * Delete data from the API
 * @param endpoint - The API endpoint to delete from
 * @returns The response data
 */
export const deleteData = async <T>(endpoint: string): Promise<T> => {
  const response = await api.delete<T>(endpoint);
  return response.data;
}; 