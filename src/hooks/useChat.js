import { API_URL } from 'config';
import axios from 'utils/axios';

export const useChat = () => {
  // fetch all discussions
  const getDiscussions = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/chat/discussions?email=${email}`);
      if (response.status === 200) return response?.data?.$values;
      else throw new Error(`get discussions failed: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.error('Erreur serveur:', error.response.status, error.response.data);
      } else {
        console.error('Erreur réseau ou autre:', error.message);
      }
    }
  };

  // fetch all formatted  discussions
  const getFormattedDiscussions = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/chat/last_discussion_message?email=${email}`);
      if (response.status === 200) return response?.data?.$values;
      else throw new Error(`get formatted discussions failed: ${response.status}`);
    } catch (error) {
      if (error.response) {
        console.error('Erreur serveur:', error.response.status, error.response.data);
      } else {
        console.error('Erreur réseau ou autre:', error.message);
      }
    }
  };

  // fetch all messages
  const getMessages = async (discussionId) => {
    try {
      const response = await axios.get(`${API_URL}/chat/messages?discussionId=${discussionId}`);
      if (response.status === 200) return response?.data?.$values;
      else throw new Error('get messages failed : ', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  // start discussion
  const startDiscussion = async (sender, receiver) => {
    try {
      if (!sender || !receiver) {
        throw new Error('Sender and Receiver emails are required.');
      }
      const response = await axios.post(`${API_URL}/chat/start?userEmail1=${sender}&userEmail2=${receiver}`);

      if (response.status === 200) {
        return response?.data;
      } else {
        throw new Error(`Starting discussion failed, server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error starting discussion:', error.response?.data || error.message);
    }
  };

  // send new message
  const sendMessage = async (discussionId, sender, message) => {
    try {
      const response = await axios.post(
        `${API_URL}/chat/send?discussionId=${encodeURIComponent(discussionId)}&senderEmail=${encodeURIComponent(
          sender
        )}&message=${encodeURIComponent(message)}`
      );
      if (response.status === 200) {
        return true;
      } else {
        throw new Error(`send message failed, server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // mark message as seen
  const markMessagesAsSeen = async (discussionId, sender) => {
    try {
      const response = await axios.put(`${API_URL}/chat/mask_as_read?discussionId=${discussionId}&email=${sender}`);
      if (response.status === 200) {
        return true;
      } else {
        throw new Error(`mask as read failed, server responded xith status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetch all discussions count
  const getTotalDiscussions = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/chat/discussions?email=${email}`);
      if (response.status === 200) return response?.data?.$values.length;
      else throw new Error('fetch Total discussions failed', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  // fetch all messages count
  const getTotalMessages = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/chat/total_messages?email=${email}`);
      if (response.status === 200) return response?.data;
      else throw new Error('fetch Total discussions failed', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  // fetch unread messages count
  const getTotalUnreadMessages = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/chat/total_unread_messages?email=${email}`);
      if (response.status === 200) return response?.data;
      else throw new Error('fetch Total discussions failed', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  // update message
  const updateMessage = async (messageId, content) => {
    try {
      const response = await axios.put(`${API_URL}/chat/update?messageId=${messageId}&message=${content}`);
      if (response.status === 200) return response?.data;
      else throw new Error('update message failed', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  // delete message
  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(`${API_URL}/chat/delete?messageId=${messageId}`);
      if (response.status === 200) return response?.data;
      else throw new Error('delete message failed', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getDiscussions,
    getFormattedDiscussions,
    getMessages,
    startDiscussion,
    sendMessage,
    markMessagesAsSeen,
    getTotalDiscussions,
    getTotalMessages,
    getTotalUnreadMessages,
    updateMessage,
    deleteMessage
  };
};

export default useChat;
