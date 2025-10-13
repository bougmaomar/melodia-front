import PropTypes from 'prop-types';
import { createContext } from 'react';

import axios from 'utils/axios';
import { API_URL } from 'config';

const AlbumContext = createContext(null);

export const AlbumProvider = ({ children }) => {
  // function to get all Albums
  const getAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/Albums`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // function to get artist's albums
  const getArtistAlbums = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Albums/artist/${id}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // function to get an album by its Id
  const getAlbumById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Albums/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Album getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  //
  const getRelatedAlbums = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Albums/relatedalbums/${id}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  //
  const getUpdatedAlbumById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Albums/album/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Album getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };
  // get albums types
  const getAlbumTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/Albums/types`);
      if (Array.isArray(response.data?.$values)) {
        return response.data?.$values;
      } else {
        console.error('Received data is not an array:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch album types:', error);
      return [];
    }
  };

  // function to add an album
  const addAlbum = async (albumData) => {
    const formData = new FormData();
    formData.append('Title', albumData.Title);
    formData.append('ReleaseDate', albumData.ReleaseDate);
    formData.append('Description', albumData.Description);
    formData.append('AlbumTypeId', albumData.AlbumTypeId);
    if (albumData.ArtistIds) {
      for (const artistId of albumData.ArtistIds) {
        formData.append('ArtistIds', artistId);
      }
    }
    if (albumData.CoverImage) {
      formData.append('CoverImage', albumData.CoverImage);
    }
    try {
      const response = await axios.post(`${API_URL}/Albums`, formData);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Add Album failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      return error;
    }
  };

  // function to update an album
  const updateAlbum = async (id, albumData) => {
    const formData = new FormData();
    formData.append('Id', albumData.Id);
    formData.append('Title', albumData.Title);
    formData.append('ReleaseDate', albumData.ReleaseDate);
    formData.append('Description', albumData.Description);
    formData.append('AlbumTypeId', albumData.AlbumTypeId);
    if (albumData.ArtistIds) {
      for (const artistId of albumData.ArtistIds) {
        formData.append('ArtistIds', artistId);
      }
    }
    if (albumData.CoverImage) {
      formData.append('CoverImage', albumData.CoverImage);
    }
    try {
      const response = await axios.put(`${API_URL}/Albums/${id}`, formData);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Update Album failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error updating album:', error);
      return error;
    }
  };

  // delete album
  const deleteAlbum = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/Albums/${id}/deactivate`);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Song deleting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  return (
    <AlbumContext.Provider
      value={{
        getAlbums,
        getArtistAlbums,
        getAlbumById,
        getRelatedAlbums,
        getUpdatedAlbumById,
        getAlbumTypes,
        addAlbum,
        updateAlbum,
        deleteAlbum
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

AlbumProvider.propTypes = {
  children: PropTypes.node
};

export default AlbumContext;
