import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState } from 'react';
import { Box, Chip, Typography, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Button, Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useExpanded, useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { CSVExport, HeaderSort, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';
import { renderFilterTypes, GlobalFilter, DateColumnFilter } from 'utils/react-table';
import { Eye, Add, Edit } from 'iconsax-react';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import { ThemeMode } from 'config';
import { PopupTransition } from 'components/@extended/Transitions';
import AddArtist from 'sections/apps/agent/AddArtist';
import useArtist from 'hooks/useArtist';
import { useNavigate } from 'react-router';
import { formatPhone } from 'utils/globals/functions';

const avatarImage = require.context('assets/images/users', true);

function ReactTable({ columns, data, handleAdd }) {
  const navigate = useNavigate();
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

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} size="large">
            <FormattedMessage id="addArtist" />
          </Button>
          <CSVExport data={data} filename={'artists-list.csv'} />
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
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => navigate(`/agent/artist/artist_detail/${row.original.email}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {row.cells.map((cell) => (
                      <TableCell key={cell.column.id} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
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
  handleAdd: PropTypes.func,
  expandedArtistEmail: PropTypes.string,
  setExpandedArtistEmail: PropTypes.func.isRequired
};

const ArtistList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const mode = theme.palette.mode;
  const [lists, setLists] = useState([]);
  const [expandedArtistEmail, setExpandedArtistEmail] = useState(null);
  const { getArtistsByAgent } = useArtist();
  const [add, setAdd] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const defaultAvatar = avatarImage('./default.jpeg');
  const userData = localStorage.getItem('user');
  const user = JSON.parse(userData);

  const handleEdit = (artistId) => {
    setSelectedArtistId(artistId);
    setAdd(true);
  };

  const fetchArtists = async () => {
    try {
      const response = await getArtistsByAgent(user.userId);
      const artistList = response.$values || [];
      setLists(artistList);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = () => {
    setAdd(!add);
    setSelectedArtistId(null);
    fetchArtists();
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'artistId',
        disableSortBy: true,
        disableFilters: true
      },
      {
        Header: <FormattedMessage id="name" />,
        accessor: 'artistRealName',
        disableFilters: true,
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar" size="sm" src={values.photoProfile ? `${API_MEDIA_URL}${values.photoProfile}` : defaultAvatar} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{values.artistRealName}</Typography>
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
        Cell: ({ value }) => formatPhone(value),
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
        Header: 'Actions',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/agent/artist/artist_detail/${row.original.email}`);
                  }}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: mode === ThemeMode.DARK ? theme.palette.grey[50] : theme.palette.grey[700],
                      opacity: 0.9
                    }
                  }
                }}
                title="Edit"
              >
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row.values.artistId);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [expandedArtistEmail]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={lists}
          handleAdd={handleAdd}
          expandedArtistEmail={expandedArtistEmail}
          setExpandedArtistEmail={setExpandedArtistEmail}
          selectedArtistId={selectedArtistId}
          setSelectedArtistId={setSelectedArtistId}
        />
      </ScrollX>
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{
          '& .MuiDialog-paper': { m: 3 },
          transition: 'transform 225ms'
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <AddArtist onClose={handleAdd} artistId={selectedArtistId} />
      </Dialog>
    </MainCard>
  );
};

ArtistList.propTypes = {
  row: PropTypes.object,
  values: PropTypes.object,
  email: PropTypes.string,
  avatar: PropTypes.node,
  photoProfile: PropTypes.node,
  artistRealName: PropTypes.string,
  careerStartDate: PropTypes.string,
  id: PropTypes.number,
  artistId: PropTypes.number,
  phoneNumber: PropTypes.string,
  value: PropTypes.object,
  toggleRowExpanded: PropTypes.func,
  active: PropTypes.bool,
  getToggleAllPageRowsSelectedProps: PropTypes.func,
  getToggleRowSelectedProps: PropTypes.func
};

export default ArtistList;
