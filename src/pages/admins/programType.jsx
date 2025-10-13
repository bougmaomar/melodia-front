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

const ProgramTypesTable = ({ programTypes, onActivate, onDeactivate, onUpdate, onDelete }) => {
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

  const sortedProgramTypes = useMemo(() => {
    let sortableItems = [...programTypes];
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
  }, [programTypes, sortConfig]);

  const paginatedProgramTypes = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedProgramTypes.slice(startIndex, endIndex);
  }, [sortedProgramTypes, page, rowsPerPage]);

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
        <Table aria-label="Program Types table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="programType" />
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
            {paginatedProgramTypes.map((programType) => (
              <TableRow key={programType.id}>
                <TableCell component="th" scope="row">
                  {programType.name}
                </TableCell>
                <TableCell align="center">
                  {programType.active ? (
                    <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                  ) : (
                    <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button onClick={() => onUpdate(programType)} color="warning" startIcon={<Edit />}>
                      <FormattedMessage id="update" />
                    </Button>
                    {programType.active ? (
                      <Button onClick={() => onDeactivate(programType)} color="error" startIcon={<Lock />}>
                        <FormattedMessage id="deactivate" />
                      </Button>
                    ) : (
                      <Button onClick={() => onActivate(programType)} color="success" startIcon={<Unlock />}>
                        <FormattedMessage id="activate" />
                      </Button>
                    )}
                    <Button onClick={() => onDelete(programType)} color="error" startIcon={<Trash />}>
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
          count={sortedProgramTypes.length}
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
const ProgramTypeModal = ({ open, onClose, programType = { name: '', active: false }, onChange, onSave, isUpdate }) => {
  ProgramTypeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    programType: PropTypes.object,
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
        {isUpdate ? <FormattedMessage id="updateProgramType" /> : <FormattedMessage id="createProgramType" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label={<FormattedMessage id="programType" />}
          type="text"
          fullWidth
          value={programType.name}
          onChange={(e) => onChange({ ...programType, name: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={programType.active}
                onChange={(e) => onChange({ ...programType, active: e.target.checked })}
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

const ProgramTypes = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [programTypes, setProgramTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProgramType, setCurrentProgramType] = useState({ name: '', active: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProgramType, setSelectedProgramType] = useState(null);

  useEffect(() => {
    fetchProgramTypes();
  }, []);

  const fetchProgramTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/ProgramTypes`);
      setProgramTypes(response.data?.$values || []);
      console.log(response.data?.$values);
    } catch (error) {
      console.error('Fetch Program Types error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (programType = { name: '', active: false }) => {
    setCurrentProgramType(programType);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const saveProgramType = async () => {
    console.log('saveProgramType function called');
    const method = currentProgramType.id ? 'put' : 'post';
    const url = `${API_URL}/ProgramTypes`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentProgramType.id,
          name: currentProgramType.name
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentProgramType.id ? 'programTypeUpdatedSuccessfully' : 'programTypeCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchProgramTypes();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentProgramType.id ? 'errorUpdatingProgramType' : 'errorCreatingProgramType' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (programType, activate = true) => {
    console.log('ProgramType received:', programType);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/ProgramTypes/${activate ? 'activate' : 'deactivate'}/${programType.id}`);
      if (response.status === 200 || response.status === 204) {
        fetchProgramTypes();
        const successMessage = formatMessage({ id: `programType${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} programType`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}ProgramType`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} programType :`, error);
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
      const response = await axios.delete(`${API_URL}/ProgramTypes/${selectedProgramType.id}`);
      if (response.status === 204) {
        fetchProgramTypes();
        openSnackbar({
          message: formatMessage({ id: 'programTypeDeletedSuccessfully' }),
          variant: 'alert',
          alert: { color: 'success' }
        });
        setOpenDelete(false);
      } else {
        throw new Error('Failed to delete stationType');
      }
    } catch (error) {
      console.error('Error deleting programType :', error);
      openSnackbar({
        message: error.message || formatMessage({ id: 'errorDeletingProgramType' }),
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (programType) => {
    setSelectedProgramType(programType);
    setOpenDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProgramTypes = useMemo(() => {
    return programTypes.filter((programType) => programType.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [programTypes, searchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignContent="center" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
            <FormattedMessage id="addProgramType" />
          </Button>
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <ProgramTypesTable
          programTypes={filteredProgramTypes}
          onActivate={(programType) => handleActivateDeactivate(programType, true)}
          onDeactivate={(programType) => handleActivateDeactivate(programType, false)}
          onUpdate={showModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}
      {isModalVisible && (
        <ProgramTypeModal
          open={isModalVisible}
          onClose={handleModalClose}
          programType={currentProgramType}
          onChange={setCurrentProgramType}
          onSave={saveProgramType}
          isUpdate={Boolean(currentProgramType.id)}
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
                  {selectedProgramType ? selectedProgramType.name : ''}
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

export default ProgramTypes;
