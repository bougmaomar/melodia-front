import PropTypes from 'prop-types';
import { useMemo, useEffect, Fragment, useState } from 'react';
import ArtistDetail from '../../sections/apps/admin/ArtistDetail';
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

function ReactTable({ columns, data, expandedArtistEmail, setExpandedArtistEmail }) {
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

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
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
              const isExpanded = row.original.email === expandedArtistEmail;
              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => setExpandedArtistEmail(isExpanded ? null : row.original.email)}
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
                          <ArtistDetail artistEmail={row.original.email} />
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
  expandedArtistEmail: PropTypes.string,
  setExpandedArtistEmail: PropTypes.func.isRequired
};

const List = () => {
  const [lists, setLists] = useState([]);
  const [expandedArtistEmail, setExpandedArtistEmail] = useState(null);
  const { getArtists, desactivateArtist, activateArtist } = useAdmin();
  const defaultAvatar = avatarImage('./default.jpeg');

  const fetchArtists = async () => {
    try {
      const ls = await getArtists();
      setLists(ls);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleActivate = async (id) => {
    try {
      await activateArtist(id);
      await fetchArtists();
    } catch (error) {
      console.error('Error activating artist:', error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await desactivateArtist(id);
      await fetchArtists();
    } catch (error) {
      console.error('Error deactivating artist:', error);
    }
  };

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
          const artistEmail = row.values.email;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="View">
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedArtistEmail(expandedArtistEmail === artistEmail ? null : artistEmail);
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
    [expandedArtistEmail, activateArtist, desactivateArtist]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={lists} expandedArtistEmail={expandedArtistEmail} setExpandedArtistEmail={setExpandedArtistEmail} />
      </ScrollX>
    </MainCard>
  );
};

List.propTypes = {
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

export default List;
