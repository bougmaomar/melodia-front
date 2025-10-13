import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from 'config';
import PropTypes from 'prop-types';

export const RadioStationContext = createContext({});

export const RadioStationProvider = ({ children }) => {
  RadioStationProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const [radioStation, setRadioStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRadioStation = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.userId) {
          throw new Error('No userId found in local storage');
        }
        const response = await axios.get(`${API_URL}/StationAccounts/${user.userId}`);
        console.log('context: ', response.data);
        setRadioStation(response.data);
      } catch (error) {
        console.error('Error fetching radio station:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioStation();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <RadioStationContext.Provider value={radioStation}>{children}</RadioStationContext.Provider>;
};
