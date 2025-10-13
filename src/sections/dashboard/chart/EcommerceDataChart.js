import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import { ThemeMode } from 'config';

// ==============================|| CHART - ECOMMERCE DATA CHART ||============================== //

const EcommerceDataChart = ({ color, height, name, data }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // chart options
  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      },
      offsetX: -2
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '80%'
      }
    },
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      }
    }
  };

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [color],
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [color, mode, primary, secondary, line, theme]);

  const [series] = useState([
    {
      name: name,
      data: data
    }
  ]);

  return <ReactApexChart options={options} series={series} type="bar" height={height ? height : 50} />;
};

EcommerceDataChart.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  name: PropTypes.string,
  data: PropTypes.array
};

export default EcommerceDataChart;
