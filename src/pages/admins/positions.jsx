import React, { useState, useEffect, useMemo } from 'react';
import {
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Stack,
  IconButton,
  TablePagination
} from '@mui/material';
import AntAvatar from 'components/@extended/Avatar';
import { Edit, Lock, Unlock, Add, Trash } from 'iconsax-react';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import axios from 'utils/axios';
import { API_URL } from 'config';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PropTypes from 'prop-types';

import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl, FormattedMessage } from 'react-intl';

const PositionsTable = ({ positions, onActivate, onDeactivate, onUpdate, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedPositions = useMemo(() => {
    let sortableItems = [...positions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [positions, sortConfig]);


  const paginatedPositions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedPositions.slice(startIndex, endIndex);
  }, [sortedPositions, page, rowsPerPage]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Position table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="position" />
                <IconButton onClick={() => requestSort('name')}>
                  {sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="status" />
              </TableCell>
              <TableCell align="center">
                <FormattedMessage id="actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPositions.map((position) => (
              <TableRow key={position.id}>
                <TableCell component="th" scope="row">
                  {position.name}
                </TableCell>
                <TableCell align="center">
                  {position.active ? (
                    <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                  ) : (
                    <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button onClick={() => onUpdate(position)} color="warning" startIcon={<Edit />}>
                      <FormattedMessage id="update" />
                    </Button>
                    {position.active ? (
                      <Button onClick={() => onDeactivate(position)} color="error" startIcon={<Lock />}>
                        <FormattedMessage id="deactivate" />
                      </Button>
                    ) : (
                      <Button onClick={() => onActivate(position)} color="success" startIcon={<Unlock />}>
                        <FormattedMessage id="activate" />
                      </Button>
                    )}
                    <Button onClick={() => onDelete(position)} color="error" startIcon={<Trash />}>
                      <FormattedMessage id="delete" />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedPositions.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </>
  );
};
const PositionModal = ({ open, onClose, position = { name: '', active: false }, onChange, onSave, isUpdate }) => {
  PositionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    position: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isUpdate: PropTypes.bool.isRequired
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': { minWidth: '600px' }
      }}
    >
      <DialogTitle id="form-dialog-title">
        {isUpdate ? <FormattedMessage id="updatePosition" /> : <FormattedMessage id="createPosition" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label={<FormattedMessage id="position" />}
          type="text"
          fullWidth
          value={position.name}
          onChange={(e) => onChange({ ...position, name: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={position.active}
                onChange={(e) => onChange({ ...position, active: e.target.checked })}
                name="active"
                color="primary"
              />
            }
            label={<FormattedMessage id="active" />}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="cancel" />
        </Button>
        <Button onClick={onSave} color="primary">
          {isUpdate ? <FormattedMessage id="update" /> : <FormattedMessage id="create" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Positions = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [positions, setPositions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ name: '', active: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Positions`);
      setPositions(response.data?.$values || []);
      console.log(response.data?.$values);
    } catch (error) {
      console.error('Fetch Positions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (position = { name: '', active: false }) => {
    setCurrentPosition(position);
    setIsModalVisible(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const savePosition = async () => {
    console.log('savePosition function called');
    const method = currentPosition.id ? 'put' : 'post';
    const url = `${API_URL}/Positions`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentPosition.id,
          name: currentPosition.name
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentPosition.id ? 'positionUpdatedSuccessfully' : 'positionCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchPositions();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentPosition.id ? 'errorUpdatingPosition' : 'errorCreatingPosition' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (position, activate = true) => {
    console.log('position received:', position);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/Positions/${activate ? 'activate' : 'deactivate'}/${position.id}`);
      if (response.status === 200 || response.status === 204) {
        fetchPositions();
        const successMessage = formatMessage({ id: `position${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} position`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}Position`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} position:`, error);
      openSnackbar({
        message: error.message || errorMessage,
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/Positions/${selectedPosition.id}`);
      if (response.status === 204) {
        fetchPositions();
        openSnackbar({
          message: formatMessage({ id: 'positionDeletedSuccessfully' }),
          variant: 'alert',
          alert: { color: 'success' }
        });
        setOpenDelete(false);
      } else {
        throw new Error('Failed to delete position');
      }
    } catch (error) {
      console.error('Error deleting position:', error);
      openSnackbar({
        message: error.message || formatMessage({ id: 'errorDeletingPosition' }),
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (genre) => {
    setSelectedPosition(genre);
    setOpenDelete(true);
  };

  const filteredPositions = useMemo(() => {
    return positions.filter((position) => position.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [positions, searchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />
        </Box>
        <Box>
          <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
            <FormattedMessage id="addPosition" />
          </Button>
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <PositionsTable
          positions={filteredPositions}
          onActivate={(position) => handleActivateDeactivate(position, true)}
          onDeactivate={(position) => handleActivateDeactivate(position, false)}
          onUpdate={showModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}
      {isModalVisible && (
        <PositionModal
          open={isModalVisible}
          onClose={handleModalClose}
          position={currentPosition}
          onChange={setCurrentPosition}
          onSave={savePosition}
          isUpdate={Boolean(currentPosition.id)}
        />
      )}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        keepMounted
        maxWidth="xs"
        aria-labelledby="column-delete-title"
        aria-describedby="column-delete-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <AntAvatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
              <Trash variant="Bold" />
            </AntAvatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                <FormattedMessage id="confirmDelete" />
              </Typography>
              <Typography align="center">
                <FormattedMessage id="delete" />?
                <Typography variant="subtitle1" component="span">
                  {selectedPosition ? selectedPosition.name : ''}
                </Typography>
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={() => setOpenDelete(false)} color="secondary" variant="outlined">
                <FormattedMessage id="cancel" />
              </Button>
              <Button fullWidth color="error" variant="contained" onClick={handleDelete} autoFocus>
                <FormattedMessage id="delete" />
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Positions;
