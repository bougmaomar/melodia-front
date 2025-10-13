import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import { Edit, Lock, Unlock, Add } from 'iconsax-react';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import axios from 'utils/axios';
import { API_URL } from 'config';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PropTypes from 'prop-types';

import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl, FormattedMessage } from 'react-intl';

const RoleTable = ({ roles, onActivate, onDeactivate, onUpdate }) => {
  RoleTable.propTypes = {
    roles: PropTypes.array.isRequired,
    onActivate: PropTypes.func.isRequired,
    onDeactivate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  };
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedRoles = React.useMemo(() => {
    let sortableItems = [...roles];
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
  }, [roles, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="roles table">
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="roleName" />
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
          {sortedRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell component="th" scope="row">
                {role.name}
              </TableCell>
              <TableCell align="center">
                {role.active ? (
                  <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                ) : (
                  <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                )}
              </TableCell>

              <TableCell align="center">
                <Button onClick={() => onUpdate(role)} color="warning" startIcon={<Edit />}>
                  <FormattedMessage id="update" defaultMessage="Update" />
                </Button>
                {role.active ? (
                  <Button onClick={() => onDeactivate(role)} color="error" startIcon={<Lock />}>
                    <FormattedMessage id="deactivate" />
                  </Button>
                ) : (
                  <Button onClick={() => onActivate(role)} color="success" startIcon={<Unlock />}>
                    <FormattedMessage id="activate" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RoleModal = ({ open, onClose, role, onChange, onSave, isUpdate }) => {
  RoleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    role: PropTypes.object.isRequired,
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
        {isUpdate ? <FormattedMessage id="updateRole" /> : <FormattedMessage id="createRole" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={<FormattedMessage id="roleName" />}
          type="text"
          fullWidth
          value={role.name}
          onChange={(e) => onChange({ ...role, name: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={role.active}
                onChange={(e) => onChange({ ...role, active: e.target.checked })}
                name="active"
                color="primary"
              />
            }
            label={<FormattedMessage id="active" defaultMessage="Active" />}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={onSave} color="primary">
          {isUpdate ? <FormattedMessage id="update" defaultMessage="Update" /> : <FormattedMessage id="create" defaultMessage="Create" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Roles = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState({ name: '', active: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Roles/all`);
      setRoles(response.data?.$values || []);
    } catch (error) {
      console.error('Fetch roles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (role = { name: '', active: false }) => {
    setCurrentRole(role);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const saveRole = async () => {
    console.log('saveRole function called');
    const method = currentRole.id ? 'put' : 'post';
    const url = `${API_URL}/Roles`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentRole.id,
          name: currentRole.name
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentRole.id ? 'roleUpdatedSuccessfully' : 'roleCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchRoles();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentRole.id ? 'errorUpdatingRole' : 'errorCreatingRole' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (role, activate = true) => {
    console.log('Role received:', role);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/Roles/${activate ? 'activate' : 'deactivate'}/${role.id}`);
      if (response.status === 204) {
        fetchRoles();
        const successMessage = formatMessage({ id: `role${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} role`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}Role`,
        defaultMessage: `Error ${activate ? 'activating' : 'deactivating'} role`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} role:`, error);
      openSnackbar({
        message: error.message || errorMessage,
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
          <FormattedMessage id='add_role'/>
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <RoleTable
          roles={roles}
          onActivate={(role) => handleActivateDeactivate(role, true)}
          onDeactivate={(role) => handleActivateDeactivate(role, false)}
          onUpdate={showModal}
        />
      )}
      {isModalVisible && (
        <RoleModal
          open={isModalVisible}
          onClose={handleModalClose}
          role={currentRole}
          onChange={setCurrentRole}
          onSave={saveRole}
          isUpdate={Boolean(currentRole.id)}
        />
      )}
    </>
  );
};

export default Roles;
