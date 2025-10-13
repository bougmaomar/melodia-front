import axios from 'utils/axios';
import { API_URL } from 'config';

export const useStation = () => {
  // Artists manage
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

  const getTopStation = async () => {
    try {
      const response = await axios.get(`${API_URL}/StationAccounts/top_station`);
      if (response && response.status === 200) {
        return response?.data;
      } else {
        throw new Error('Getting top station failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getStationById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/StationAccounts/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Station getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
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
      console.error('Get error: ', error);
    }
  };

  const updateStation = async (stationData) => {
    const formData = new FormData();
    let descriptionWithLineBreaks = stationData.description.replace(/\r?\n/g, '<br />');

    formData.append('stationId', stationData.stationId);
    formData.append('accountId', stationData.accountId);
    formData.append('Email', stationData.email);
    formData.append('PhoneNumber', stationData.phoneNumber);
    formData.append('Description', descriptionWithLineBreaks);
    formData.append('StationId', stationData.stationId);
    formData.append('CityId', stationData.cityId);
    formData.append('StationName', stationData.stationName);
    formData.append('FoundationDate', stationData.foundationDate);
    formData.append('Frequency', stationData.frequency);
    formData.append('WebSite', stationData.webSite);
    formData.append('StationOwner', stationData.stationOwner);
    formData.append('StationTypeId', stationData.stationTypeId);

    if (stationData.logo) {
      formData.append('Logo', stationData.logo);
    }

    try {
      const response = await axios.put(`${API_URL}/StationAccounts/${stationData.stationId}/${stationData.accountId}`, formData);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Update artist by agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('get error: ', error);
    }
  };

  const proposeSong = async (artistId, stationId, songId, description) => {
    try {
      const formData = new FormData();
      formData.append('songId', songId);
      const response = await axios.post(
        `${API_URL}/SongProposal/propose?artistId=${artistId}&radioStationId=${stationId}&description=${description}`,
        formData
      );
      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error('Propose Song failed, server responded with status: ' + response.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const proposeSongAllStations = async (artistId, songId, description) => {
    try {
      const list_stations = await getStations();
      for (let i = 0; i < list_stations.length; i++) {
        const stationId = list_stations[i].stationId;
        const response = await proposeSong(artistId, stationId, songId, description);
        if (!response) {
          throw new Error('Propose Song to all stations failed for station: ' + list_stations[i].stationName);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendToAccepted = async (artistId, stationId, songId) => {
    try {
      const response = await axios.post(
        `${API_URL}/SongProposal/toAccepted?artistId=${artistId}&songId=${songId}&radioStationId=${stationId}`
      );
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Send song failed, server responded with status: ' + response.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAcceptedSong = async (stationId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/accepted_proposals?radioStationId=${stationId}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Accepted songs getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  return {
    getStations,
    getTopStation,
    getStationById,
    getStationByEmail,
    updateStation,
    proposeSong,
    proposeSongAllStations,
    sendToAccepted,
    getAcceptedSong
  };
};

export default useStation;
