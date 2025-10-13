import axios from 'utils/axios';
import { API_URL } from 'config';

export const useAdmin = () => {
  // Artists manage
  const getArtists = async () => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Artists getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getArtistByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/accountByEmail/${email}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Artist getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
    console.log('Get artist by email: ', email);
  };

  const desactivateArtist = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/ArtistAccounts/deactivate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Desactivate artist failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const activateArtist = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/ArtistAccounts/activate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Activate artist failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // Agents manage
  const getAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/AgentAccounts`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Agents getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getAgentByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/AgentAccounts/accountByEmail/${email}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Agent getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
    console.log('Get agent by email: ', email);
  };

  const getStationByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/StationAccounts/accountByEmail/${email}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Station getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
    console.log('Get station by email: ', email);
  };

  const desactivateAgent = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/AgentAccounts/deactivate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Desactivate agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const activateAgent = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/AgentAccounts/activate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Activate agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const acceptAgent = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/AgentAccounts/accept/${id}`);
      if (response && (response.status === 204 || response.status === 200)) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Accept agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const rejectAgent = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/AgentAccounts/reject/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Reject agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // Stations manage
  const getStations = async () => {
    try {
      const response = await axios.get(`${API_URL}/StationAccounts`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Stations getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const desactivateStation = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/StationAccounts/deactivate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Desactivate station failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const activateStation = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/StationAccounts/activate/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Activate station failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const acceptStation = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/StationAccounts/accept/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Accept station failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const rejectStation = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/StationAccounts/reject/${id}`);
      if (response && response.status === 204) {
        console.log(response.status);
        return true;
      } else {
        throw new Error('Reject station failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // Languages manage
  const getLanguages = async () => {
    try {
      const response = await axios.get(`${API_URL}/Languages`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Languages getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const addLanguage = async (language) => {
    try {
      const response = await axios.post(`${API_URL}/Languages`, language);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Language adding failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const updateLanguage = async (language) => {
    try {
      const response = await axios.put(`${API_URL}/Languages`, language);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Language adding failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const deleteLanguage = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/Languages?id=${id}`);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Language deleting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // Music types manage
  const getGenreMusics = async () => {
    try {
      const response = await axios.get(`${API_URL}/GenreMusics`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('GenreMusics getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const addGenreMusic = async (genre) => {
    try {
      const response = await axios.post(`${API_URL}/GenreMusics`, genre);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Genre adding failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const updateGenreMusic = async (genre) => {
    try {
      const response = await axios.put(`${API_URL}/GenreMusics`, genre);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Genre adding failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const deleteGenreMusic = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/GenreMusics?id=${id}`);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Genre deleting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/countries`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Countries getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getCities = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/cities/country/${id}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Cities getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getCityById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/cities/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Cities getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getStationType = async () => {
    try {
      const response = await axios.get(`${API_URL}/StationTypes`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('station types getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const PutResetPassord = async (id, password) => {
    try {
      const response = await axios.put(`${API_URL}/Account/password/${id}`, { newPassword: password });
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Reset password failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  return {
    getArtists,
    getArtistByEmail,
    desactivateArtist,
    activateArtist,
    getAgents,
    getAgentByEmail,
    getStationByEmail,
    desactivateAgent,
    activateAgent,
    acceptAgent,
    rejectAgent,
    getStations,
    desactivateStation,
    activateStation,
    rejectStation,
    acceptStation,
    getLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    getGenreMusics,
    addGenreMusic,
    updateGenreMusic,
    deleteGenreMusic,
    getCountries,
    getCities,
    getCityById,
    getStationType,
    PutResetPassord
  };
};

export default useAdmin;
