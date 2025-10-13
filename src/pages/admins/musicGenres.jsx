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
  IconButton
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

const MusicGenreTable = ({ musicGenres, onActivate, onDeactivate, onUpdate, onDelete }) => {
  MusicGenreTable.propTypes = {
    musicGenres: PropTypes.array.isRequired,
    onActivate: PropTypes.func.isRequired,
    onDeactivate: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedMusicGenres = React.useMemo(() => {
    let sortableItems = [...musicGenres];
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
  }, [musicGenres, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="musicGenres table">
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage id="musicGenreName" />
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
          {sortedMusicGenres.map((musicGenre) => (
            <TableRow key={musicGenre.id}>
              <TableCell component="th" scope="row">
                {musicGenre.name}
              </TableCell>
              <TableCell align="center">
                {musicGenre.active ? (
                  <Chip label={<FormattedMessage id="active" />} color="success" size="small" />
                ) : (
                  <Chip label={<FormattedMessage id="inactive" />} color="error" size="small" />
                )}
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button onClick={() => onUpdate(musicGenre)} color="warning" startIcon={<Edit />}>
                    <FormattedMessage id="update" defaultMessage="Update" />
                  </Button>
                  {musicGenre.active ? (
                    <Button onClick={() => onDeactivate(musicGenre)} color="error" startIcon={<Lock />}>
                      <FormattedMessage id="deactivate" />
                    </Button>
                  ) : (
                    <Button onClick={() => onActivate(musicGenre)} color="success" startIcon={<Unlock />}>
                      <FormattedMessage id="activate" />
                    </Button>
                  )}
                  <Button onClick={() => onDelete(musicGenre)} color="error" startIcon={<Trash />}>
                    <FormattedMessage id="delete" />
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MusicGenreModal = ({ open, onClose, musicGenre, onChange, onSave, isUpdate }) => {
  MusicGenreModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    musicGenre: PropTypes.object.isRequired,
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
        {isUpdate ? <FormattedMessage id="updateMusicGenre" /> : <FormattedMessage id="createMusicGenre" />}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={<FormattedMessage id="musicGenreName" />}
          type="text"
          fullWidth
          value={musicGenre.name}
          onChange={(e) => onChange({ ...musicGenre, name: e.target.value })}
        />
        {!isUpdate && (
          <FormControlLabel
            control={
              <Checkbox
                checked={musicGenre.active}
                onChange={(e) => onChange({ ...musicGenre, active: e.target.checked })}
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

const MusicGenres = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [musicGenres, setMusicGenres] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMusicGenre, setCurrentMusicGenre] = useState({ name: '', active: false });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    fetchMusicGenres();
  }, []);

  const fetchMusicGenres = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/GenreMusics`);
      setMusicGenres(response.data?.$values || []);
    } catch (error) {
      console.error('Fetch music Genres error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (musicGenre = { name: '', active: false }) => {
    setCurrentMusicGenre(musicGenre);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const saveGenreMusic = async () => {
    console.log('saveGenreMusic function called');
    const method = currentMusicGenre.id ? 'put' : 'post';
    const url = `${API_URL}/GenreMusics`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: currentMusicGenre.id,
          name: currentMusicGenre.name
        }
      });

      console.log('API response:', response);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Dispatching success snackbar');
        dispatch(
          openSnackbar({
            message: formatMessage({ id: currentMusicGenre.id ? 'genreMusicUpdatedSuccessfully' : 'genreMusicCreatedSuccessfully' }),
            variant: 'alert',
            alert: { color: 'success' }
          })
        );
        fetchMusicGenres();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      console.log('Dispatching error snackbar');
      dispatch(
        openSnackbar({
          message: error.message || formatMessage({ id: currentMusicGenre.id ? 'errorUpdatingGenreMusic' : 'errorCreatingGenreMusic' }),
          variant: 'alert',
          alert: { color: 'error' }
        })
      );
    }
    handleModalClose();
  };

  const handleActivateDeactivate = async (role, activate = true) => {
    console.log('Genre Music received:', role);
    const actionKey = activate ? 'Activated' : 'Deactivated';
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/GenreMusics/${activate ? 'activate' : 'deactivate'}/${role.id}`);
      if (response.status === 200 || response.status === 204) {
        fetchMusicGenres();
        const successMessage = formatMessage({ id: `genreMusic${actionKey}Successfully` });
        openSnackbar({
          message: successMessage,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } else {
        throw new Error(`Failed to ${activate ? 'activate' : 'deactivate'} genre Music`);
      }
    } catch (error) {
      const errorMessage = formatMessage({
        id: `error${actionKey}GenreMusic`
      });
      console.error(`Error ${activate ? 'activating' : 'deactivating'} genre Music:`, error);
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
      const response = await axios.delete(`${API_URL}/GenreMusics/${selectedGenre.id}`);
      if (response.status === 204) {
        fetchMusicGenres();
        openSnackbar({
          message: formatMessage({ id: 'genreMusicDeletedSuccessfully' }),
          variant: 'alert',
          alert: { color: 'success' }
        });
        setOpenDelete(false);
      } else {
        throw new Error('Failed to delete genre Music');
      }
    } catch (error) {
      console.error('Error deleting genre Music:', error);
      openSnackbar({
        message: error.message || formatMessage({ id: 'errorDeletingGenreMusic' }),
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (genre) => {
    setSelectedGenre(genre);
    setOpenDelete(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMusicGenres = useMemo(() => {
    return musicGenres.filter((musicGenre) => musicGenre.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [musicGenres, searchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignContent="center" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <TextField label={<FormattedMessage id="search" />} variant="outlined" value={searchTerm} onChange={handleSearch} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={() => showModal()} startIcon={<Add />}>
            <FormattedMessage id="Add_Music_Genre" />
          </Button>
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <MusicGenreTable
          musicGenres={filteredMusicGenres}
          onActivate={(musicGenre) => handleActivateDeactivate(musicGenre, true)}
          onDeactivate={(musicGenre) => handleActivateDeactivate(musicGenre, false)}
          onUpdate={showModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}
      {isModalVisible && (
        <MusicGenreModal
          open={isModalVisible}
          onClose={handleModalClose}
          musicGenre={currentMusicGenre}
          onChange={setCurrentMusicGenre}
          onSave={saveGenreMusic}
          isUpdate={Boolean(currentMusicGenre.id)}
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
                  {selectedGenre ? selectedGenre.name : ''}
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

export default MusicGenres;
