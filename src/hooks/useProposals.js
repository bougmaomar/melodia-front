import axios from 'utils/axios';
import { API_URL } from 'config';

const useProposals = () => {
  const getProposals = async (stationId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/proposals?radioStationId=${stationId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Proposals getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getAllProposalsCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/all_count`);
      if (response && response.status === 200) {
        return response?.data;
      } else {
        throw new Error('Getting count failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getAllAcceptedProposalsCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/all_accepts_count`);
      if (response && response.status === 200) {
        return response?.data;
      } else {
        throw new Error('Getting count failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getProposalsByType = async (stationId, typeId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/proposals/type?stationId=${stationId}&typeId=${typeId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Proposals getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getProposalsByLanguage = async (stationId, languageId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/proposals/language?stationId=${stationId}&languageId=${languageId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Proposals getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getProposalsByArtist = async (stationId, artistId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/proposals/artist?stationId=${stationId}&artistId=${artistId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Proposals getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getAllProposalsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/all_proposals_by_artists?artistId=${artistId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Proposals getting failed, server respnded with status: ', response.status);
      }
    } catch (error) {
      console.error('Get error : ', error);
    }
  };

  const getAllAcceptedProposalsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/all_accepted_proposals_artist?artistId=${artistId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('All Accepted proposals getting failed, server responded with status: ', response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getAllAcceptedProposalsByAgent = async (agentId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/all_accepted_proposals_by_agent?agentId=${agentId}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Agent accepted proposals getting failed, server responded with status: ', response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getMensualProposalsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/mensual_proposals?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('get mensual proposals failed ', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAnnualProposalsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/annual_proposals?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('get annual proposals failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProposalsNumber = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/suggest_number?songId=${songId}`);
      if (response.status === 200) {
        return response?.data;
      } else {
        return new Error('get suggestion number failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getProposals,
    getAllProposalsCount,
    getAllAcceptedProposalsCount,
    getProposalsByType,
    getProposalsByLanguage,
    getProposalsByArtist,
    getAllProposalsByArtist,
    getAllAcceptedProposalsByArtist,
    getAllAcceptedProposalsByAgent,
    getMensualProposalsByArtist,
    getAnnualProposalsByArtist,
    getProposalsNumber
  };
};

export default useProposals;
