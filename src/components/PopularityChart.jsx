import React from 'react';
import { Box, Typography } from '@mui/material';

const PopularityChart = ({ value = 0 }) => {
  // Fonction pour déterminer la couleur en fonction de la valeur
  const getStrokeColor = (value) => {
    const colors = [
      '#b71c1c', // 0-4%
      '#c62828', // 5-9%
      '#d32f2f', // 10-14%
      '#e53935', // 15-19%
      '#f44336', // 20-24%
      '#ff9800', // 25-29% (orange)
      '#ffc107', // 30-34% (yellow-orange)
      '#ffeb3b', // 35-39% (yellow)
      '#cddc39', // 40-44% (yellow-green)
      '#a5d6a7', // 45-49% (light green)
      '#ffeb3b', // 50-54% (yellow again for emphasis at 50%)
      '#81c784', // 55-59% (light green)
      '#66bb6a', // 60-64%
      '#4caf50', // 65-69%
      '#43a047', // 70-74%
      '#388e3c', // 75-79%
      '#2e7d32', // 80-84%
      '#1b5e20', // 85-89%
      '#145a32', // 90-94%
      '#094625' // 95-100%
    ];

    const index = Math.min(Math.floor(value / 5), 19);
    return colors[index];
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '40%'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex'
        }}
      >
        <svg width={80} height={80}>
          <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="6" fill="none" />
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke={getStrokeColor(value)} // Couleur dynamique
            strokeWidth="6"
            fill="none"
            strokeDasharray="220" // Circonférence du cercle (2 * Math.PI * r)
            strokeDashoffset={220 - (220 * value) / 100} // Ajustement basé sur la valeur
            strokeLinecap="round"
            transform="rotate(-90 40 40)" // Rotation pour commencer en haut
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant="subtitle1" component="div">
            {value}/100
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

import PropTypes from 'prop-types';

PopularityChart.propTypes = {
  value: PropTypes.number
};

export default PopularityChart;
