import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ThemeMode } from 'config';
import { useIntl } from 'react-intl';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Tab, Tabs } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import ReactApexChart from 'react-apexcharts';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| CHART ||============================== //

const EcommerceDataChart = ({ data, categories }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    fill: {
      opacity: [1, 0.5]
    },
    grid: {
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => ' ' + val + ' '
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary.main],
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: Array(categories.length).fill(secondary)
          }
        },
        axisBorder: {
          show: false,
          color: line
        },
        axisTicks: {
          show: false
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      legend: {
        labels: {
          colors: 'secondary.main'
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme, categories]);

  const [series, setSeries] = useState(data);

  useEffect(() => {
    setSeries(data);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
};

EcommerceDataChart.propTypes = {
  data: PropTypes.array,
  categories: PropTypes.array
};

// ==============================|| CHART WIDGET - PROJECT ANALYTICS ||============================== //

export default function ProjectAnalytics({ allDecade, decadeCategories, allDuration, allAcceptDecade, allAcceptDuration }) {
  const [value, setValue] = useState(0);
  const { formatMessage } = useIntl();

  const chartData = [
    [
      {
        name: formatMessage({ id: 'allSongs' }),
        data: allDecade
      },
      {
        name: formatMessage({ id: 'acceptedSongs' }),
        data: allAcceptDecade
      }
    ],
    [
      {
        name: formatMessage({ id: 'allSongs' }),
        data: allDuration
      },
      {
        name: formatMessage({ id: 'acceptedSongs' }),
        data: allAcceptDuration
      }
    ]
  ];
  const categoriesChart = [decadeCategories, ['<1m', '<2m', '<3m', '<4m', '<5m', '>5m']];

  const [data, setData] = useState(chartData[0]);
  const [categories, setCategories] = useState(categoriesChart[0]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setData(chartData[newValue]);
    setCategories(categoriesChart[newValue]);
  };

  return (
    <MainCard content={false}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3, pt: 1, '& .MuiTab-root': { mb: 0.5 } }}>
            <Tab label={formatMessage({ id: 'byDecade' })} {...a11yProps(0)} />
            <Tab label={formatMessage({ id: 'byDuration' })} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Stack spacing={2}>
                <EcommerceDataChart data={data} categories={categories} />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainCard>
  );
}
ProjectAnalytics.propTypes = {
  allDecade: PropTypes.array,
  decadeCategories: PropTypes.array,
  allDuration: PropTypes.array,
  allAcceptDecade: PropTypes.array,
  allAcceptDuration: PropTypes.array
};
