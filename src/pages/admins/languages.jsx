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

const LanguagesTable = ({ languages, onActivate, onDeactivate, onUpdate, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'label', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedLanguages = useMemo(() => {
    let sortableItems = [...languages];
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
  }, [languages, sortConfig]);

  const paginatedLanguages = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedLanguages.slice(startIndex, endIndex);
  }, [sortedLanguages, page, rowsPerPage]);

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
        <Table aria-label="Language table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="languageName" />
                <IconButton onClick={() => requestSort('label')}>
                  {sortConfig.key === 'label' && sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
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
            {paginatedLanguages.map((language) => (
              <TableRow key={language.id}>
                <TableCell component="th" scope="row">
                  {language.label}
                </TableCell>
                <TableCell align="center">
                  {language.active ? (
                    <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                  ) : (
                    <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button onClick={() => onUpdate(language)} color="warning" startIcon={<Edit />}>
                      <FormattedMessage id="update" />
                    </Button>
                    {language.active ? (
                      <Button onClick={() => onDeactivate(language)} color="error" startIcon={<Lock />}>
                        <FormattedMessage id="deactivate" />
                      </Button>
                    ) : (
                      <Button onClick={() => onActivate(language)} color="success" startIcon={<Unlock />}>
                        <FormattedMessage id="activate" />
                      </Button>
                    )}
                    <Button onClick={() => onDelete(language)} color="error" startIcon={<Trash />}>
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
          count={sortedLanguages.length}
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
const LanguageModal = ({ open, onClose, language = { label: '', active: false }, onChange, onSave, isUpdate }) => {
  LanguageModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    language: PropTypes.object,
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
        {isUpdate ? <FormattedMessage id="updateLanguage" /> : <FormattedMessage id="createLanguage" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label={<FormattedMessage id="languageName" />}
          type="text"
          fullWidth
          value={language.label}
          onChange={(e) => onChange({ ...language, label: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={language.active}
                onChange={(e) => onChange({ ...language, active: e.target.checked })}
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

const Languages = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [languages, setLanguages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState({ label: '', active: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Languages`);
      setLanguages(response.data?.$values || []);
      console.log(response.data?.$values);
    } catch (error) {
      console.error('Fetch Languages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (language = { label: '', active: false }) => {
    setCurrentLanguage(language);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const saveLanguage = async () => {
    console.log('saveLanguage function called');
    const method = currentLanguage.id ? 'put' : 'post';
    const url = `${API_URL}/Languages`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentLanguage.id,
          label: currentLanguage.label
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentLanguage.id ? 'languageUpdatedSuccessfully' : 'languageCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchLanguages();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentLanguage.id ? 'errorUpdatingLanguage' : 'errorCreatingLanguage' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (language, activate = true) => {
    console.log('language received:', language);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/Languages/${activate ? 'activate' : 'deactivate'}/${language.id}`);
      if (response.status === 200 || response.status === 204) {
        fetchLanguages();
        const successMessage = formatMessage({ id: `language${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} language`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}Language`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} language:`, error);
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
      const response = await axios.delete(`${API_URL}/Languages/${selectedLanguage.id}`);
      if (response.status === 204) {
        fetchLanguages();
        openSnackbar({
          message: formatMessage({ id: 'languagesDeletedSuccessfully' }),
          variant: 'alert',
          alert: { color: 'success' }
        });
        setOpenDelete(false);
      } else {
        throw new Error('Failed to delete language');
      }
    } catch (error) {
      console.error('Error deleting language:', error);
      openSnackbar({
        message: error.message || formatMessage({ id: 'errorDeletingLanguage' }),
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (genre) => {
    setSelectedLanguage(genre);
    setOpenDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) => language.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [languages, searchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignContent="center" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
            Add Language
          </Button>
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <LanguagesTable
          languages={filteredLanguages}
          onActivate={(language) => handleActivateDeactivate(language, true)}
          onDeactivate={(language) => handleActivateDeactivate(language, false)}
          onUpdate={showModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}
      {isModalVisible && (
        <LanguageModal
          open={isModalVisible}
          onClose={handleModalClose}
          language={currentLanguage}
          onChange={setCurrentLanguage}
          onSave={saveLanguage}
          isUpdate={Boolean(currentLanguage.id)}
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
                  {selectedLanguage ? selectedLanguage.label : ''}
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

export default Languages;
