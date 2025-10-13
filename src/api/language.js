import axios from 'utils/axios';
import useSWR from 'swr';

export const endpoints = {
  getAllLanguages: '/Languages',
  createLanguage: '/Languages',
  updateLanguage: '/Languages',
  deleteLanguage: '/Languages',
  getLanguageById: (languageId) => `/Languages/${languageId}`
};

export function useGetLanguages() {
  const { data, error } = useSWR(endpoints.getAllLanguages, fetcher);

  return {
    languages: data,
    languagesLoading: !data && !error,
    languagesError: error
  };
}

// Function to fetch all languages
export async function getLanguages() {
  try {
    const response = await axios.get(endpoints.getAllLanguages);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    throw error;
  }
}

// Function to insert a new language
export async function insertLanguage(newLanguage) {
  try {
    const response = await axios.post(endpoints.createLanguage, newLanguage);
    return response.data;
  } catch (error) {
    console.error('Failed to insert language:', error);
    throw error;
  }
}

export async function updateLanguage(languageId, updatedLanguage) {
  try {
    const response = await axios.put(`${endpoints.updateLanguage}/${languageId}`, updatedLanguage);
    return response.data;
  } catch (error) {
    console.error('Failed to update language:', error);
    throw error;
  }
}

// Function to delete a language
export async function deleteLanguage(languageId) {
  try {
    const response = await axios.delete(`${endpoints.deleteLanguage}/${languageId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete language :', error);
    throw error;
  }
}
