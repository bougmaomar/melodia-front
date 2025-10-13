import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useContext } from 'react';
import { UserContext } from './UserContext';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project-imports
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { API_URL } from 'config';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);

  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const init = async () => {
      const serviceToken = localStorage.getItem('serviceToken');
      const userData = localStorage.getItem('user');
      if (serviceToken && verifyToken(serviceToken)) {
        setSession(serviceToken);
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        }
      } else {
        dispatch({ type: LOGOUT });
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/Authentication/login`, { email, password });
      if (response && response.status === 200) {
        const { accessToken, user } = response.data;
        if (accessToken !== null || user !== null) {
          localStorage.setItem('serviceToken', accessToken.hash);
          setSession(accessToken.hash);
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        }
        return response.data;
      } else {
        throw new Error('Login failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      return error;
    }
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const artistRegister = async (email, password, firstName, lastName, name, careerStartDate, phoneNumber) => {
    try {
      const id = chance.bb_pin();
      const response = await axios.post(`${API_URL}/ArtistAccounts`, {
        firstName: firstName,
        lastName: lastName,
        name: name,
        careerStartDate: careerStartDate,
        phoneNumber: phoneNumber,
        email: email,
        password: password
      });
      console.log(response);
      updateArtistsInLocalStorage({
        id,
        email,
        firstName,
        lastName,
        careerStartDate,
        phoneNumber
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        console.error('Status code:', error.response);
        console.error('Headers:', error.response.headers);
        throw new Error(error.response.data.message || 'API Error: An error occurred during the API call.');
      } else if (error.request) {
        console.error('Network Error: No response was received', error.request);
        throw new Error('Network Error: Please check your internet connection.');
      } else {
        console.error('Error:', error.message);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const updateArtistsInLocalStorage = ({ id, email, firstName, lastName, careerStartDate, phoneNumber }) => {
    let artists = JSON.parse(window.localStorage.getItem('artists')) || [];
    artists.push({
      id,
      email,
      name: `${firstName} ${lastName}`,
      // userName,
      careerStartDate,
      phoneNumber
    });
    window.localStorage.setItem('artists', JSON.stringify(artists));
  };

  const agentRegister = async (firstName, lastName, userName, artistsNum, webSite, careerStartDate, phoneNumber, email, password) => {
    try {
      const id = chance.bb_pin();
      console.log("i'm heeere", password);
      const response = await axios.post(`${API_URL}/AgentAccounts`, {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        artistsNum: artistsNum,
        webSite: webSite,
        careerStartDate: careerStartDate,
        phoneNumber: phoneNumber,
        email: email,
        password: password
      });

      updateAgentsInLocalStorage({
        id,
        email,
        firstName,
        lastName,
        userName,
        careerStartDate,
        phoneNumber,
        artistsNum,
        webSite
      });

      console.log('operation successed');
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        throw new Error(error.response.data.message || 'API Error: An error occurred during the API call.');
      } else if (error.request) {
        console.error('Network Error: No response was received', error.request);
        throw new Error('Network Error: Please check your internet connection.');
      } else {
        console.error('Error:', error.message);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const updateAgentsInLocalStorage = ({ id, email, firstName, lastName, userName, careerStartDate, phoneNumber, artistsNum, webSite }) => {
    let agents = JSON.parse(window.localStorage.getItem('agents')) || [];
    agents.push({
      id,
      email,
      name: `${firstName} ${lastName}`,
      userName,
      careerStartDate,
      phoneNumber,
      artistsNum,
      webSite
    });
    window.localStorage.setItem('agents', JSON.stringify(agents));
  };

  const stationRegister = async (
    email,
    password,
    stationName,
    stationOwner,
    stationTypeId,
    cityId,
    foundationDate,
    frequency,
    webSite,
    phoneNumber
  ) => {
    try {
      const id = chance.bb_pin();
      const response = await axios.post(`${API_URL}/StationAccounts`, {
        email,
        password,
        stationName,
        stationOwner,
        stationTypeId,
        cityId,
        foundationDate,
        frequency,
        webSite,
        phoneNumber
      });
      console.log('heeere: ', response.status);
      if (response.status === 201 || response.status === 200) {
        updateStationsInLocalStorage({
          id,
          email,
          stationName,
          stationOwner,
          stationTypeId,
          cityId,
          foundationDate,
          frequency,
          webSite,
          phoneNumber
        });
        return response.data;
      } else {
        throw new Error('Failed to register station. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        throw new Error(error.response.data.message || 'API Error: An error occurred during the API call.');
      } else if (error.request) {
        console.error('Network Error: No response was received', error.request);
        throw new Error('Network Error: Please check your internet connection.');
      } else {
        console.error('Error:', error.message);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const updateStationsInLocalStorage = ({
    id,
    email,
    stationName,
    stationOwner,
    stationTypeId,
    foundationDate,
    webSite,
    cityId,
    frequency,
    phoneNumber
  }) => {
    let stations = JSON.parse(window.localStorage.getItem('stations')) || [];
    stations.push({
      id,
      email,
      stationName,
      stationOwner,
      foundationDate,
      stationTypeId,
      webSite,
      frequency,
      cityId,
      phoneNumber
    });
    window.localStorage.setItem('stations', JSON.stringify(stations));
  };

  const logout = () => {
    setSession(null);
    localStorage.clear();
    console.log('User has been logged out and local storage cleared.');
    window.location.reload();
    dispatch({ type: LOGOUT });
  };

  const artistResetPassword = async (email, oldP, newP) => {
    try {
      const request = {
        email: email,
        currentPassword: oldP,
        newPassword: newP
      };
      const response = await axios.put(`${API_URL}/ArtistAccounts/Change-password`, request);

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      return error.$values[0].description;
    }
  };

  const agentResetPassword = async (email, oldP, newP) => {
    try {
      const request = {
        email: email,
        currentPassword: oldP,
        newPassword: newP
      };
      const response = await axios.put(`${API_URL}/AgentAccounts/Change-password`, request);

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      return error.$values[0].description;
    }
  };

  const stationResetPassword = async (email, oldP, newP) => {
    try {
      const request = {
        email: email,
        currentPassword: oldP,
        newPassword: newP
      };
      const response = await axios.put(`${API_URL}/StationAccounts/Change-password`, request);

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      return error.$values[0].description;
    }
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        artistRegister,
        agentRegister,
        stationRegister,
        artistResetPassword,
        agentResetPassword,
        stationResetPassword,
        updateProfile
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
