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

const StationTypesTable = ({ stationTypes, onActivate, onDeactivate, onUpdate, onDelete }) => {
  StationTypesTable.propTypes = {
    stationTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired
      })
    ).isRequired,
    onActivate: PropTypes.func.isRequired,
    onDeactivate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

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

  const sortedStationTypes = useMemo(() => {
    let sortableItems = [...stationTypes];
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
  }, [stationTypes, sortConfig]);

  const paginatedStationTypes = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedStationTypes.slice(startIndex, endIndex);
  }, [sortedStationTypes, page, rowsPerPage]);

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
        <Table aria-label="Station Types table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="stationTypes" />
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
            {paginatedStationTypes.map((stationType) => (
              <TableRow key={stationType.id}>
                <TableCell component="th" scope="row">
                  {stationType.name}
                </TableCell>
                <TableCell align="center">
                  {stationType.active ? (
                    <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                  ) : (
                    <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button onClick={() => onUpdate(stationType)} color="warning" startIcon={<Edit />}>
                      <FormattedMessage id="update" />
                    </Button>
                    {stationType.active ? (
                      <Button onClick={() => onDeactivate(stationType)} color="error" startIcon={<Lock />}>
                        <FormattedMessage id="deactivate" />
                      </Button>
                    ) : (
                      <Button onClick={() => onActivate(stationType)} color="success" startIcon={<Unlock />}>
                        <FormattedMessage id="activate" />
                      </Button>
                    )}
                    <Button onClick={() => onDelete(stationType)} color="error" startIcon={<Trash />}>
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
          count={sortedStationTypes.length}
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
const StationTypeModal = ({ open, onClose, stationType = { name: '', active: false }, onChange, onSave, isUpdate }) => {
  StationTypeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    stationType: PropTypes.object,
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
        {isUpdate ? <FormattedMessage id="updateStationType" /> : <FormattedMessage id="createStationType" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label={<FormattedMessage id="stationType" />}
          type="text"
          fullWidth
          value={stationType.name}
          onChange={(e) => onChange({ ...stationType, name: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={stationType.active}
                onChange={(e) => onChange({ ...stationType, active: e.target.checked })}
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

const StationTypes = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [stationTypes, setStationTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStationType, setCurrentStationType] = useState({ name: '', active: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedStationType, setSelectedStationType] = useState(null);

  useEffect(() => {
    fetchStationTypes();
  }, []);

  const fetchStationTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/StationTypes`);
      setStationTypes(response.data?.$values || []);
      console.log(response.data?.$values);
    } catch (error) {
      console.error('Fetch Station Types error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (stationType = { name: '', active: false }) => {
    setCurrentStationType(stationType);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const saveStationType = async () => {
    console.log('saveStationType function called');
    const method = currentStationType.id ? 'put' : 'post';
    const url = `${API_URL}/StationTypes`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentStationType.id,
          name: currentStationType.name
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentStationType.id ? 'stationTypeUpdatedSuccessfully' : 'stationTypeCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchStationTypes();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentStationType.id ? 'errorUpdatingStationType' : 'errorCreatingStationType' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (stationType, activate = true) => {
    console.log('stationType received:', stationType);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/StationTypes/${activate ? 'activate' : 'deactivate'}/${stationType.id}`);
      if (response.status === 200 || response.status === 204) {
        fetchStationTypes();
        const successMessage = formatMessage({ id: `stationType${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} stationType`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}StationType`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} stationType :`, error);
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
      const response = await axios.delete(`${API_URL}/StationTypes/${selectedStationType.id}`);
      if (response.status === 204) {
        fetchStationTypes();
        openSnackbar({
          message: formatMessage({ id: 'stationTypeDeletedSuccessfully' }),
          variant: 'alert',
          alert: { color: 'success' }
        });
        setOpenDelete(false);
      } else {
        throw new Error('Failed to delete stationType');
      }
    } catch (error) {
      console.error('Error deleting stationType :', error);
      openSnackbar({
        message: error.message || formatMessage({ id: 'errorDeletingStationType' }),
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (stationType) => {
    setSelectedStationType(stationType);
    setOpenDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStationTypes = useMemo(() => {
    return stationTypes.filter((stationType) => stationType.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stationTypes, searchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignContent="center" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
            <FormattedMessage id="addStationType" />
          </Button>
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <StationTypesTable
          stationTypes={filteredStationTypes}
          onActivate={(stationType) => handleActivateDeactivate(stationType, true)}
          onDeactivate={(stationType) => handleActivateDeactivate(stationType, false)}
          onUpdate={showModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}
      {isModalVisible && (
        <StationTypeModal
          open={isModalVisible}
          onClose={handleModalClose}
          stationType={currentStationType}
          onChange={setCurrentStationType}
          onSave={saveStationType}
          isUpdate={Boolean(currentStationType.id)}
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
                  {selectedStationType ? selectedStationType.name : ''}
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

export default StationTypes;
