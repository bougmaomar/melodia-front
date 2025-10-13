import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import EcommerceDataChart from './EcommerceDataChart';
import { useNavigate } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
// ==============================|| CHART WIDGETS - NEW USERS ||============================== //

const NewProposals = ({ mensual, annual, type }) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const history = useNavigate();
  const [age, setAge] = useState('10');
  const [data, setData] = useState(mensual);
  const totalData = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 10) {
      setData(mensual);
    } else if (selectedValue === 20) {
      setData(annual);
    }

    setAge(selectedValue);
  };

  const handleViewAll = () => {
    type == 'artist' ? history('/artist/suggest/0') : history('/agent/suggest/0');
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">
              <FormattedMessage id="proposals" />
            </Typography>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <Select id="demo-simple-select" value={age} onChange={handleChange}>
                  <MenuItem value={10}>
                    <FormattedMessage id="mensual" />
                  </MenuItem>
                  <MenuItem value={20}>
                    <FormattedMessage id="annual" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {data && (
            <EcommerceDataChart
              key={age}
              color={theme.palette.error.main}
              height={100}
              name={formatMessage({ id: 'proposals' })}
              data={data}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="subtitle1">Total: {totalData}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="outlined" color="secondary" onClick={handleViewAll}>
            <FormattedMessage id="viewMore" />
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default NewProposals;
