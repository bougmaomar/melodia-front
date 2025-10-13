// third-party
import { createSlice } from '@reduxjs/toolkit';

// project-imports
import axios from 'utils/axios';
import { dispatch } from '../index';

const initialState = {
  error: null,
  chats: [],
  user: {},
  users: []
};

// ==============================|| SLICE - CHAT ||============================== //

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.user = action.payload;
    },

    // GET USER CHATS
    getUserChatsSuccess(state, action) {
      state.chats = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.users = action.payload;
    }
  }
});

// Reducer
export default chat.reducer;

export function getUser(id) {
  return async () => {
    try {
      //     const response = await axios.post('/api/chat/users/id', { id });
      const users = [
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        },
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        },
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        }
      ];
      console.log(users[id]);
      dispatch(chat.actions.getUserSuccess(users[id]));
      // dispatch(chat.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(chat.actions.hasError(error));
    }
  };
}

export function getUserChats(user) {
  return async () => {
    try {
      // const response = await axios.post('/api/chat/filter', { user });
      // dispatch(chat.actions.getUserChatsSuccess(response.data));
      console.log(user);
      const chats = [
        {
          from: 'User1',
          id: 1,
          text: 'Hi Good Morning!',
          time: '11:23 AM',
          to: 'Alene'
        },
        {
          from: 'Alene',
          id: 2,
          text: 'Hey. Very Good morning. How are you?',
          time: '11:23 AM',
          to: 'User1'
        },
        {
          from: 'User1',
          id: 3,
          text: 'Good. Thank you',
          time: '11:23 AM',
          to: 'Alene'
        }
      ];
      dispatch(chat.actions.getUserChatsSuccess(chats));
    } catch (error) {
      dispatch(chat.actions.hasError(error));
    }
  };
}

export function insertChat(chat) {
  return async () => {
    try {
      await axios.post('/api/chat/insert', chat);
    } catch (error) {
      dispatch(chat.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async () => {
    try {
      // const response = await axios.get('/api/chat/users');
      // dispatch(chat.actions.getUsersSuccess(response.data.users));

      const users = [
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        },
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        },
        {
          avatar: 'avatar-1.png',
          birthdayText: 'happy Birthday Alene',
          company: 'ABC Pvt Ltd',
          id: 1,
          lastMessage: '2h ago',
          location: 'Port Narcos',
          name: 'Alene',
          online_status: 'available',
          personal_email: 'alene@company.com',
          personal_phone: '380-293-0177',
          role: 'Sr. Customer Manager',
          status: 'Technical Department',
          unReadChatCount: 2,
          work_email: 'alene_work@company.com',
          work_phone: '380-293-0177'
        }
      ];
      dispatch(chat.actions.getUsersSuccess(users));
    } catch (error) {
      dispatch(chat.actions.hasError(error));
    }
  };
}
