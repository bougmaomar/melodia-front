import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';

// project-importds
import MainCard from 'components/MainCard';
import EcommerceDataChart from './EcommerceDataChart';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
// ==============================|| CHART WIDGETS - VISITORS ||============================== //

const NewAccepts = ({ mensual, annual, type }) => {
  const theme = useTheme();
  const history = useNavigate();
  const { formatMessage } = useIntl();
  const [age, setAge] = useState('10');
  const [data, setData] = useState(mensual);
  const totalData = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const handleChange = (event) => {
    const seletedAge = event.target.value;
    if (seletedAge == 10) {
      setData(mensual);
    }
    if (seletedAge == 20) {
      setData(annual);
    }
    setAge(seletedAge);
  };

  const handleViewAll = () => {
    type == 'artist' ? history('/artist/profile/basic') : history('/agent/artists');
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">
              <FormattedMessage id="visits" />
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
          <EcommerceDataChart
            key={age}
            color={theme.palette.success.main}
            height={100}
            name={formatMessage({ id: 'visits' })}
            data={data}
          />
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

export default NewAccepts;
