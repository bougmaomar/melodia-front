import axios from 'utils/axios';
import { API_URL } from 'config';

export const useAgent = () => {
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
  // Agents manage
  const getAgentByEmail = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/AgentAccounts/accountByEmail/${email}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Agents getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getAllSongsByAgent = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/AgentAccounts/songs/agent/${id}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Songs getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getAllAlbumsByAgent = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/AgentAccounts/albums/agent/${id}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Songs getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const updateAgent = async (agentData) => {
    const formData = new FormData();
    formData.append('agentId', agentData.agentId);
    formData.append('accountId', agentData.accountId);
    formData.append('Email', agentData.email);
    formData.append('PhoneNumber', agentData.phoneNumber);
    formData.append('ArtistsNum', agentData.artistsNum);
    formData.append('WebSite', agentData.webSite);
    formData.append('AgentId', agentData.agentId);
    formData.append('CityId', agentData.cityId);
    formData.append('FirstName', agentData.firstName);
    formData.append('LastName', agentData.lastName);
    formData.append('CareerStartDate', agentData.careerStartDate);
    formData.append('Bio', agentData.bio);

    if (agentData.photoProfile) {
      formData.append('PhotoProfile', agentData.photoProfile);
    }
    try {
      const response = await axios.put(`${API_URL}/AgentAccounts/${agentData.agentId}/${agentData.accountId}`, formData);
      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error('Update agent failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  return {
    getAgentByEmail,
    getAgents,
    getAllSongsByAgent,
    getAllAlbumsByAgent,
    updateAgent
  };
};

export default useAgent;
