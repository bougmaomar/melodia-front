import { Paper, Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const StatsCard = ({ title, value, icon, trend }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'white.main',
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'text.secondary' }}>{title}</Typography>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, mt: 0.5 }}>{value}</Typography>

          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: trend.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: trend.isPositive ? 'success.main' : 'error.main'
                }}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', ml: 0.75 }}>
                <FormattedMessage id="vsLastMonth" />
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCard;
