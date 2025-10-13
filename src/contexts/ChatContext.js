import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useChat from 'hooks/useChat';

const ChatContext = createContext();

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || '';
  const {
    getFormattedDiscussions,
    getMessages,
    sendMessage,
    markMessagesAsSeen,
    startDiscussion,
    updateMessage,
    deleteMessage
  } = useChat();

  const [discussions, setDiscussions] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatId, setChatId] = useState(0);
  const [contactName, setContactName] = useState('');
  const [role, setRole] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const lastFetchTimeRef = useRef(0); // 🕒 pour limiter la fréquence

  const fetchDiscussions = useCallback(async () => {
    if (!user || !user.email) return;

    const now = Date.now();
    if (now - lastFetchTimeRef.current < 1000) return; // 💡 ignore si < 1s

    lastFetchTimeRef.current = now;

    try {
      const [discRaw] = await Promise.all([getFormattedDiscussions(user?.email)]);
      const disc = Array.isArray(discRaw) ? discRaw : [];
      const sortedDiscussions = disc.sort((a, b) => new Date(b.time) - new Date(a.time));
      setDiscussions(sortedDiscussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      setDiscussions([]);
    }
  }, [getFormattedDiscussions, user]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    const response = await getMessages(chatId);
    setMessages(response);
  }, [chatId, getMessages]);

  useEffect(() => {
    if (user?.email) {
      fetchDiscussions();
    }
  }, [user?.email, fetchDiscussions]);

  useEffect(() => {
    user && fetchMessages();
  }, [chatId, refresh, fetchMessages, user]);

  const sendChatMessage = async (chatId, content) => {
    if (content.trim()) {
      const res = await sendMessage(chatId, user.email, content);
      if (res) {
        setRefresh((prev) => !prev);
        fetchMessages();
        return true;
      }
    }
  };

  const handleChatClick = async (chat) => {
    if (chat.unread > 0) {
      await markMessagesAsSeenHandler(chat.id);
    }
    setCurrentChat(chat);
    setChatId(chat.id);
    setContactName(chat.name);
    setRole(chat.role);
    setReceiverEmail(chat.email);
    fetchMessages();
    return true;
  };

  const startChat = async (userEmail, email) => {
    const res = await startDiscussion(userEmail, email);
    if (res) return res;
  };

  const markMessagesAsSeenHandler = async (chatId) => {
    await markMessagesAsSeen(chatId, user.email);
  };

  const updateMessageAsync = async (id, content) => {
    const response = await updateMessage(id, content);
    if (response) {
      setRefresh((prev) => !prev);
      return true;
    }
  };

  const deleteMessageAsync = async (id) => {
    const res = await deleteMessage(id);
    if (res) {
      setRefresh((prev) => !prev);
      return res;
    }
  };

  ChatProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <ChatContext.Provider
      value={{
        discussions,
        fetchDiscussions,
        messages,
        fetchMessages,
        startChat,
        sendChatMessage,
        markMessagesAsSeenHandler,
        setRefresh,
        refresh,
        currentChat,
        setCurrentChat,
        chatId,
        contactName,
        role,
        receiverEmail,
        handleChatClick,
        updateMessageAsync,
        deleteMessageAsync
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
