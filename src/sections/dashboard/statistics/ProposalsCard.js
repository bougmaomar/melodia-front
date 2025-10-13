import { Card, Box, CardMedia, Typography, Stack, IconButton, Button, Chip } from '@mui/material';
import { Clock, TickCircle, ArrowForward, ArrowRight, Heart } from 'iconsax-react';
import { Cancel } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { API_MEDIA_URL } from 'config';
import { FormattedMessage } from 'react-intl';
import { extractMinutesSeconds, handleDownloadSong } from 'utils/globals/functions';
import { useNavigate } from 'react-router';
import useSongs from 'hooks/useSongs';
import { useEffect, useState } from 'react';
import AudioPlayer from 'components/AudioPlayer';
import axios from 'axios';
import { API_URL } from 'config';
import { toast, ToastContainer } from 'react-toastify';
import { useIntl } from 'react-intl';

const ProposalsCard = ({ proposals }) => {
  const history = useNavigate();
  const { getSongById, putDownloads, putPlays, isSongFavorited, addFavoriteSong, removeFavoriteSong } = useSongs();
  const user = JSON.parse(localStorage.getItem('user'));
  const { formatMessage } = useIntl();
  const [song, setSong] = useState();
  const [isFavorited, setIsFavorited] = useState([]);

  useEffect(() => {
    const fetchSong = async () => {
      if (proposals && proposals.length > 0) {
        const [songData] = await Promise.all([getSongById(proposals[0].song.id)]);
        setSong(songData);
      }
    };
    fetchSong();
  }, [proposals, getSongById]);
  const getStatus = (status) => {
    if (status == 0) return <FormattedMessage id="pending" />;
    if (status == 1) return <FormattedMessage id="accepted" />;
    if (status == 2) return <FormattedMessage id="rejected" />;
  };

  useEffect(() => {
    const checkAllFavorited = async () => {
      if (proposals && proposals.length > 0) {
        const favoritedMap = {};
        for (const s of proposals) {
          try {
            const favorited = await isSongFavorited(user.id, s.song.id);
            favoritedMap[s.song.id] = favorited;
          } catch (error) {
            favoritedMap[s.song.id] = false;
          }
        }
        setIsFavorited(favoritedMap);
      }
    };
    checkAllFavorited();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song, isSongFavorited, user.userId]);

  console.log('isFavorited:', isFavorited);
  const handleFavoriteToggle = async (songId) => {
    try {
      if (isFavorited[songId]) {
        if (typeof removeFavoriteSong === 'function') {
          await removeFavoriteSong(user.id, songId);
        }
        setIsFavorited((prev) => ({ ...prev, [songId]: false }));
        // toast.error(formatMessage({ id: 'songRemovedFromFavorites' }));
      } else {
        if (typeof addFavoriteSong === 'function') {
          await addFavoriteSong(user.id, songId);
        }
        setIsFavorited((prev) => ({ ...prev, [songId]: true }));
        // toast.success(formatMessage({ id: 'songAddedToFavorites' }));
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const handleAccept = async (radioStationId, songId) => {
    try {
      console.log('Accepting proposal for songId:', songId, 'radioStationId:', radioStationId);
      const response = await axios.post(`${API_URL}/SongProposal/accept`, null, {
        params: { radioStationId, songId }
      });
      if (response.status === 200) {
        toast.success(formatMessage({ id: 'proposalAccepted' }));
        history(`/radio-station/songs/details/${songId}/accepted`);
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
    }
  };

  const handleReject = async (radioStationId, songId) => {
    try {
      const response = await axios.post(`${API_URL}/SongProposal/reject`, null, {
        params: { radioStationId, songId }
      });
      if (response.status === 200) {
        toast.error(formatMessage({ id: 'proposalRejected' }));
        history(`/radio-station/songs/details/${songId}/accepted`);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  const StyledChip = styled(Chip)(({ status }) => {
    const styles = {
      0: { borderColor: 'rgb(188, 142, 5)', backgroundColor: 'rgba(255, 193, 7, 0.2)', color: 'rgb(188, 142, 5)' },
      1: { borderColor: 'rgb(20, 139, 9)', backgroundColor: 'rgba(16, 225, 54, 0.2)', color: 'rgb(20, 139, 9)' },
      2: { borderColor: 'rgb(148, 23, 12)', backgroundColor: 'rgba(254, 34, 34, 0.2)', color: 'rgb(148, 23, 12)' }
    };
    return styles[status] || { borderColor: 'inherit', backgroundColor: 'transparent', color: 'inherit' };
  });

  const handleTime = (date) => {
    const now = new Date();
    const timeDiff = now - new Date(date); // Ensure 'date' is a Date object

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `il y a ${seconds} secondes`;
    if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (months < 12) return `il y a ${months} mois`;
    return `il y a ${years} an${years > 1 ? 's' : ''}`;
  };

  const handleViewAll = () => {
    history(`/radio-station/proposals`);
  };

  const handleGoToDetails = (id, status) => {
    const statusName = status == 0 ? 'pending' : status == 1 ? 'accepted' : 'rejected';
    history(`/radio-station/songs/details/${id}/${statusName}`);
  };

  return (
    <>
      <ToastContainer />

      <Stack direction="row" alignItems="start" justifyContent="space-between" sx={{ marginY: 3, marginX: 4 }}>
        <Typography variant="h4">
          <FormattedMessage id="new_add_proposals" />
        </Typography>

        <Button
          variant="combined"
          color="primary"
          endIcon={<ArrowForward />}
          onClick={() => handleViewAll()}
          sx={{
            color: '#3275E1',
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 'bold',
            padding: '8px 16px'
          }}
        >
          <FormattedMessage id="viewAll" />
        </Button>
      </Stack>
      {proposals.map((proposal) => (
        <Card
          key={proposal.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            m: 1,
            p: 2,
            cursor: 'pointer',
            flexWrap: 'wrap'
          }}
        >
          {/* Section Gauche - Image + Titre + Artistes + Durée */}
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 300 }}>
            <CardMedia
              component="img"
              sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
              image={proposal.song.coverImagePath ? `${API_MEDIA_URL}${proposal.song.coverImagePath}` : 'https://via.placeholder.com/80'}
              alt={proposal.song.title}
            />
            <Box>
              <Typography variant="h6">{proposal.song.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {proposal.song.artists?.$values.map((artist) => artist.name).join(', ') || 'N/A'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Clock size={14} style={{ marginRight: 4 }} />
                <Typography variant="body2" color="text.secondary">
                  {extractMinutesSeconds(proposal.song.duration)}
                </Typography>
                <Chip label={proposal.song.genreMusic} size="small" sx={{ ml: 2 }} />
              </Box>
            </Box>
          </Box>

          {/* Section Centre - Audio Player */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: 200 }}>
            <AudioPlayer
              src={proposal.song && `${API_MEDIA_URL}${proposal.song.mp3FilePath}`}
              onDownload={() => handleDownloadSong(proposal.song.mp3FilePath, 'Station', putDownloads, proposal.song.id, user.userId)}
              onPlay={() => putPlays(proposal.song.id, user.userId)}
            />
          </Box>

          {/* Section Droite - Statut + Date + Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1, minWidth: 250 }}>
            <StyledChip label={getStatus(proposal.status)} size="small" status={proposal.status} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {handleTime(proposal.proposalDate)}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: 'crimson' }} onClick={() => handleFavoriteToggle(proposal.song.id)}>
                <Heart variant={isFavorited[proposal.song.id] ? 'Bold' : 'Linear'} />
              </IconButton>
              <IconButton
                sx={{ '&:hover': { color: 'green' } }}
                onClick={() => handleAccept(user.userId, proposal.song.id)}
                disabled={proposal.status !== 0}
              >
                <TickCircle />
              </IconButton>
              <IconButton
                sx={{ '&:hover': { color: 'red' } }}
                onClick={() => handleReject(user.userId, proposal.song.id)}
                disabled={proposal.status !== 0}
              >
                <Cancel />
              </IconButton>
              <IconButton
                sx={{ '&:hover': { color: 'blue' } }}
                onClick={() => handleGoToDetails(proposal.song.id, proposal.status)}
                disabled={proposal.status !== 0}
              >
                <ArrowRight />
              </IconButton>
            </Stack>
          </Box>
        </Card>
      ))}
    </>
  );
};

import PropTypes from 'prop-types';

ProposalsCard.propTypes = {
  proposals: PropTypes.array.isRequired
};

export default ProposalsCard;
