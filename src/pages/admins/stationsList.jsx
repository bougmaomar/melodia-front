import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState, useRef } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import {
  Box,
  Chip,
  LinearProgress,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// third-party
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';

// project-imports
import StationDetail from '../../sections/apps/admin/StationDetail';
// import Loader from 'components/Loader';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import AlertColumnDelete from 'sections/apps/kanban/Board/AlertColumnDelete';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { alertPopupToggle } from 'store/reducers/invoice';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
// assets
import { Eye, Lock, LockSlash } from 'iconsax-react';
import useAdmin from 'hooks/useAdmin';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, expandedStationEmail, setExpandedStationEmail, setStatus }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['logo', 'email', 'id'],
      pageIndex: 0,
      pageSize: 5
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      defaultColumn,
      initialState
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const handleGetStatus = (data) => {
    setStatus(data);
  };

  const componentRef = useRef(null);

  // ================ Tab ================

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={matchDownSM ? 1 : 2}>
          <CSVExport data={data} filename={'Radio-Stations.csv'} />
        </Stack>
      </Stack>
      <Box ref={componentRef}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.id} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const isExpanded = row.original.email === expandedStationEmail;
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => setExpandedStationEmail(isExpanded ? null : row.original.email)}
                    sx={{ cursor: 'pointer', bgcolor: isExpanded ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.column.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <Box sx={{ p: 2 }}>
                          <StationDetail stationEmail={row.values.email} onGetStatus={handleGetStatus} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  expandedStationEmail: PropTypes.string,
  setExpandedStationEmail: PropTypes.func.isRequired
};

// ==============================|| INVOICE - LIST ||============================== //

const StationList = () => {
  // const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [expandedStationEmail, setExpandedStationEmail] = useState(null);
  const { getStations, desactivateStation, activateStation } = useAdmin();
  const defaultAvatar = avatarImage('./default.jpeg');
  const [status, setStatus] = useState('');

  const fetchStations = async () => {
    try {
      const ls = await getStations();
      setLists(ls);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    fetchStations();
  }, [status]);

  const handleActivate = async (id) => {
    try {
      await activateStation(id);
      await fetchStations();
    } catch (error) {
      console.error('Error activating station:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await desactivateStation(id);
      await fetchStations();
    } catch (error) {
      console.error('Error deactivating station:', error);
    }
  };

  useEffect(() => {
    setLists(lists);
  }, [lists]);
  const navigation = useNavigate();
  const handleClose = (status) => {
    if (status) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Column deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
    }
    dispatch(
      alertPopupToggle({
        alertToggle: false
      })
    );
  };

  const columns = useMemo(
    () => [
      //   {
      //     title: 'Row Selection',
      //     Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
      //     accessor: 'selection',
      //     Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
      //     disableSortBy: true,
      //     disableFilters: true
      //   },
      {
        Header: '#',
        accessor: 'stationId',
        disableSortBy: true,
        disableFilters: true
      },

      {
        Header: 'Name',
        accessor: 'stationName',
        disableFilters: true,
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar" size="sm" src={values.logo ? `${API_MEDIA_URL}${values.logo}` : defaultAvatar} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.stationName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {values.email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'id',
        accessor: 'id'
      },
      {
        Header: 'Photo',
        accessor: 'logo',
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: <FormattedMessage id="startDate" />,
        accessor: 'foundationDate',
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-CA')
      },
      {
        Header: 'Status',
        accessor: 'active',
        disableFilters: true,
        filter: '',
        Cell: ({ value }) => {
          switch (value) {
            case false:
              return <Chip color="error" label={<FormattedMessage id="inactive" />} size="small" variant="light" />;
            case true:
              return <Chip color="success" label={<FormattedMessage id="active" />} size="small" variant="light" />;
            default:
              return <Chip color="info" label="None" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Demande Status',
        accessor: 'status',
        disableFilters: true,
        filter: '',
        Cell: ({ value }) => {
          switch (value) {
            case 'Accepted':
              return <Chip color="success" label={<FormattedMessage id="Accepted" />} size="small" variant="light" />;
            case 'Rejected':
              return <Chip color="error" label={<FormattedMessage id="Rejected" />} size="small" variant="light" />;
            case 'ToAccept':
              return <Chip color="warning" label={<FormattedMessage id="ToAccept" />} size="small" variant="light" />;
            default:
              return <Chip color="info" label="None" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          const stationEmail = row.values.email;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedStationEmail(expandedStationEmail === stationEmail ? null : stationEmail);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>

              <Tooltip title="activate">
                <IconButton
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivate(row.values.id);
                  }}
                >
                  <LockSlash />
                </IconButton>
              </Tooltip>
              <Tooltip title="desactivate">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeactivate(row.values.id);
                  }}
                >
                  <Lock />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [navigation, expandedStationEmail, activateStation, desactivateStation]
  );

  return (
    <>
      <MainCard content={false}>
        <ScrollX>
        <ReactTable columns={columns} data={lists} expandedStationEmail={expandedStationEmail} setExpandedStationEmail={setExpandedStationEmail} setStatus={setStatus}/>
        </ScrollX>
      </MainCard>
      <AlertColumnDelete title={`test`} handleClose={handleClose} />
    </>
  );
};

StationList.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  logo: PropTypes.node,
  stationName: PropTypes.string,
  invoice_id: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.number,
  stationId: PropTypes.number,
  phoneNumber: PropTypes.string,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  active: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

function LinearWithLabel({ value, ...others }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="warning" variant="determinate" value={value} {...others} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="white">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearWithLabel.propTypes = {
  value: PropTypes.number,
  others: PropTypes.any
};

export default StationList;
