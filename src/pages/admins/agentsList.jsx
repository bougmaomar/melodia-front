import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState } from 'react';
import AgentDetail from '../../sections/apps/admin/AgentDetail';
import { Box, Chip, Typography, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { Eye, Lock, LockSlash } from 'iconsax-react';
import useAdmin from 'hooks/useAdmin';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);

function ReactTable({ columns, data, expandedAgentEmail, setExpandedAgentEmail, setStatus }) {
  const theme = useTheme();
  const defaultColumn = useMemo(() => ({ Filter: DateColumnFilter }), []);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const initialState = useMemo(
    () => ({
      filters: [{ id: 'status', value: '' }],
      hiddenColumns: ['photoProfile', 'email', 'id'],
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

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CSVExport data={data} filename={'agents-list.csv'} />
        </Stack>
      </Stack>
      <Box>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
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
              const isExpanded = row.original.email === expandedAgentEmail;
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => setExpandedAgentEmail(isExpanded ? null : row.original.email)}
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
                          <AgentDetail agentEmail={row.original.email} onGetStatus={handleGetStatus} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={columns.length}>
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
  expandedAgentEmail: PropTypes.string,
  setExpandedAgentEmail: PropTypes.func.isRequired
};

const AgentList = () => {
  const [lists, setLists] = useState([]);
  const [expandedAgentEmail, setExpandedAgentEmail] = useState(null);
  const { getAgents, desactivateAgent, activateAgent } = useAdmin();
  const defaultAvatar = avatarImage('./default.jpeg');
  const [status, setStatus] = useState('');

  const fetchAgents = async () => {
    try {
      const ls = await getAgents();
      setLists(ls);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [status]);

  const handleActivate = async (id) => {
    try {
      await activateAgent(id);
      await fetchAgents();
    } catch (error) {
      console.error('Error activating agent:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await desactivateAgent(id);
      await fetchAgents();
    } catch (error) {
      console.error('Error deactivating agent:', error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'agentId',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: <FormattedMessage id="name" />,
        accessor: 'agentRealName',
        disableFilters: true,
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar" size="sm" src={values.photoProfile ? `${API_MEDIA_URL}${values.photoProfile}` : defaultAvatar} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.agentRealName}</Typography>
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
        accessor: 'photoProfile',
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: <FormattedMessage id="startDate" />,
        accessor: 'careerStartDate',
        Cell: ({ value }) => new Date(value).toLocaleDateString('en-CA')
      },
      {
        Header: <FormattedMessage id="phoneNumber" />,
        accessor: 'phoneNumber',
        disableFilters: true
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
              return <Chip color="success" label={<FormattedMessage id="accepted" />} size="small" variant="light" />;
            case 'Rejected':
              return <Chip color="error" label={<FormattedMessage id="rejected" />} size="small" variant="light" />;
            case 'ToAccept':
              return <Chip color="warning" label={<FormattedMessage id="toAccept" />} size="small" variant="light" />;
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
          const agentEmail = row.values.email;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedAgentEmail(expandedAgentEmail === agentEmail ? null : agentEmail);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Activate">
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
              <Tooltip title="Deactivate">
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
    [expandedAgentEmail, activateAgent, desactivateAgent]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={lists}
          expandedAgentEmail={expandedAgentEmail}
          setExpandedAgentEmail={setExpandedAgentEmail}
          setStatus={setStatus}
        />
      </ScrollX>
    </MainCard>
  );
};

AgentList.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  photoProfile: PropTypes.node,
  agentRealName: PropTypes.string,
  invoice_id: PropTypes.string,
  id: PropTypes.number,
  agentId: PropTypes.number,
  status: PropTypes.string,
  phoneNumber: PropTypes.string,
  careerStartDate: PropTypes.string,
  webSite: PropTypes.string,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  active: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

export default AgentList;
