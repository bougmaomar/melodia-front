import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

const ReportCard = ({ primary, secondary, color, iconPrimary }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: color, mr: 2 }}>{iconPrimary}</Avatar>
          <Box>
            <Typography variant="h4">{primary}</Typography>
            <Typography variant="body2" color="textSecondary">
              {secondary}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  secondary: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  iconPrimary: PropTypes.node.isRequired
};

export default ReportCard;
