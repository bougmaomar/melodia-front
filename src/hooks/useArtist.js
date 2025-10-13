import axios from 'utils/axios';
import { API_URL } from 'config';

export const useArtist = () => {
  // Artists manage

  const addArtistByAgent = async (artistData) => {
    const formData = new FormData();

    formData.append('FirstName', artistData.firstname);
    formData.append('LastName', artistData.lastname);
    formData.append('Name', artistData.userName);
    formData.append('CareerStartDate', artistData.careerStartDate);
    formData.append('Bio', artistData.bio);
    formData.append('AgentId', artistData.agentId);
    formData.append('CityId', artistData.cityId);
    formData.append('Facebook', artistData.facebook);
    formData.append('Youtube', artistData.youtube);
    formData.append('Spotify', artistData.spotify);
    formData.append('Instagram', artistData.instagram);
    formData.append('Google', artistData.google);
    formData.append('Email', artistData.email);
    formData.append('PhoneNumber', artistData.phoneNumber);

    try {
      const response = await axios.post(`${API_URL}/ArtistAccounts/byAgent`, formData);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Create artist by agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Post error:', error);
      throw error;
    }
  };

  const getArtistById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/AccountById/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Artists getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getArtistsByAgent = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/byAgent/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Artists getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getArtistByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/accountByEmail/${email}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Artists getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const updateArtist = async (artistData) => {
    const formData = new FormData();

    formData.append('artistId', artistData.artistId);
    formData.append('accountId', artistData.accountId);
    formData.append('Email', artistData.email);
    formData.append('PhoneNumber', artistData.phoneNumber);
    formData.append('ArtistId', artistData.artistId);
    formData.append('CityId', artistData.cityId);
    formData.append('Name', artistData.name);
    formData.append('FirstName', artistData.firstName);
    formData.append('LastName', artistData.lastName);
    formData.append('CareerStartDate', artistData.careerStartDate);
    formData.append('Bio', artistData.bio);
    formData.append('Google', artistData.google);
    formData.append('Facebook', artistData.facebook);
    formData.append('Instagram', artistData.instagram);
    formData.append('Youtube', artistData.youtube);
    formData.append('Spotify', artistData.spotify);

    if (artistData.photoProfile) {
      formData.append('PhotoProfile', artistData.photoProfile);
    }
    try {
      const response = await axios.put(`${API_URL}/ArtistAccounts/${artistData.artistId}/${artistData.accountId}`, formData);
      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error('Update artist failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const updateArtistByAgent = async (artistData) => {
    const formData = new FormData();

    formData.append('Artistid', artistData.artistId);
    formData.append('Name', artistData.userName);
    formData.append('FirstName', artistData.firstname);
    formData.append('LastName', artistData.lastname);
    formData.append('CareerStartDate', artistData.careerStartDate);
    formData.append('Bio', artistData.bio);
    formData.append('AgentId', artistData.agentId);
    formData.append('CityId', artistData.cityId);
    formData.append('Facebook', artistData.facebook);
    formData.append('Youtube', artistData.youtube);
    formData.append('Spotify', artistData.spotify);
    formData.append('Instagram', artistData.instagram);
    formData.append('Google', artistData.google);
    formData.append('Email', artistData.email);
    formData.append('PhoneNumber', artistData.phoneNumber);

    if (artistData.photoProfile) {
      formData.append('PhotoProfile', artistData.photoProfile);
    }
    try {
      const response = await axios.put(`${API_URL}/ArtistAccounts/byAgent/${artistData.artistId}`, formData);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Update artist by agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Put error:', error);
      throw error;
    }
  };

  const desactivateArtist = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/ArtistAccounts/deactivate/${id}`);
      if (response && response.status === 204) {
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
        return true;
      } else {
        throw new Error('Activate artist failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const recordVisit = async (artistId, radioStationId) => {
    try {
      const response = await axios.post(`${API_URL}/ArtistAccounts/record_visit?artistId=${artistId}&radioStationId=${radioStationId}`);
      if (response && response.status === 200) {
        return true;
      } else {
        throw new error('Recording visit failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error :', error);
    }
  };

  const getAllVisitsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/all_visits?artistId=${artistId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Recording visit failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error :', error);
    }
  };

  const getMensualVisitsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/mensual_visits?artistId=${artistId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('get mensual visits failed, ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getAnnualVisitsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/annual_visits?artistId=${artistId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('get annual visits failed, ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getPlaysComparaison = async (artistId, comparedId) => {
    try {
      const response = await axios.get(`${API_URL}/ArtistAccounts/comparaison_plays?artistId=${artistId}&comparedId=${comparedId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('get plays comparaison failed; ' + response.status);
      }
    } catch (error) {
      console.error('Get error :', error);
    }
  };

  return {
    getArtistById,
    getArtistByEmail,
    getArtistsByAgent,
    updateArtist,
    updateArtistByAgent,
    desactivateArtist,
    activateArtist,
    addArtistByAgent,
    recordVisit,
    getAllVisitsByArtist,
    getMensualVisitsByArtist,
    getAnnualVisitsByArtist,
    getPlaysComparaison
  };
};

export default useArtist;
