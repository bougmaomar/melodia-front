import React, { useState, useMemo } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, IconButton, Chip, Box, Stack, Pagination } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from 'axios';
import { API_URL, API_MEDIA_URL } from 'config';
import { Clock, TickCircle } from 'iconsax-react';
import { useNavigate } from 'react-router';
import { extractMinutesSeconds, getTimeAgo } from 'utils/globals/functions';
import { toast, ToastContainer } from 'react-toastify';

const ProposalList = ({ proposals, user, fetchProposals }) => {
  const history = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [page, setPage] = useState(1);
  const proposalsPerPage = 6;
  const { formatMessage } = useIntl();

  const filteredProposals = proposals.filter((proposal) =>
    filter === 'all' ? true : proposal.status === (filter === 'pending' ? 0 : filter === 'accepted' ? 1 : filter === 'rejected' ? 2 : 2)
  );

  const getStatus = (status) => {
    if (status == 0) return <FormattedMessage id="pending" />;
    if (status == 1) return <FormattedMessage id="accepted" />;
    if (status == 2) return <FormattedMessage id="rejected" />;
  };

  const StyledChip = styled(Chip)(({ status }) => {
    const styles = {
      0: { borderColor: 'rgb(188, 142, 5)', backgroundColor: 'rgba(255, 193, 7, 0.2)', color: 'rgb(188, 142, 5)' },
      1: { borderColor: 'rgb(20, 139, 9)', backgroundColor: 'rgba(16, 225, 54, 0.2)', color: 'rgb(20, 139, 9)' },
      2: { borderColor: 'rgb(148, 23, 12)', backgroundColor: 'rgba(254, 34, 34, 0.2)', color: 'rgb(148, 23, 12)' }
    };
    return styles[status] || { borderColor: 'inherit', backgroundColor: 'transparent', color: 'inherit' };
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAccept = async (radioStationId, songId) => {
    try {
      const response = await axios.post(`${API_URL}/SongProposal/accept`, null, {
        params: { radioStationId, songId }
      });
      if (response.status === 200) {
        toast.success(formatMessage({ id: 'proposalAccepted' }));
        fetchProposals();
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
        fetchProposals();
        history(`/radio-station/songs/details/${songId}/rejected`);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  const handleGoToDetails = (id, status) => {
    const statusName = status == 0 ? 'pending' : status == 1 ? 'accepted' : 'rejected';
    if (!event.target.closest('button') && !event.target.closest('svg')) {
      history(`/radio-station/songs/details/${id}/${statusName}`);
    }
  };

  const paginatedProposals = useMemo(() => {
    return filteredProposals.slice((page - 1) * proposalsPerPage, page * proposalsPerPage);
  }, [filteredProposals, page]);

  return (
    <>
      <ToastContainer />
      <Box>
        {/* Filter Buttons */}
        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 2, ml: 6 }}>
          <Grid item></Grid>
          <Grid item>
            {['all', 'pending', 'accepted', 'rejected'].map((status) => (
              <Button
                key={status}
                onClick={() => setFilter(status)}
                sx={{ border: 'none', p: 0, m: 0, minWidth: 'auto', background: 'transparent' }}
              >
                <Chip
                  label={<FormattedMessage id={status} />}
                  variant={filter === status ? 'filled' : 'outlined'}
                  style={{ marginInline: 4 }}
                />
              </Button>
            ))}
          </Grid>
        </Stack>

        {/* Proposal List */}
        {paginatedProposals.length > 0 ? (
          paginatedProposals.map((proposal) => (
            <Card
              key={proposal.id}
              sx={{ display: 'flex', alignItems: 'center', m: 1, p: 1, px: 2, cursor: 'pointer' }}
              onClick={() => handleGoToDetails(proposal.song.id, proposal.status)}
            >
              {/* Left Section - Cover, Title, Artist, Duration */}
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, borderRadius: 1 }}
                  image={
                    proposal.song.coverImagePath ? `${API_MEDIA_URL}${proposal.song.coverImagePath}` : 'https://via.placeholder.com/80'
                  }
                  alt={proposal.song.title}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h4">{proposal.song.title}</Typography>
                  <Typography variant="body1" color="textSecondary" marginBottom={1}>
                    {proposal.song.artists?.$values.map((artist) => artist.name).join(', ') || 'N/A'}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" style={{ marginTop: 2 }}>
                    <Clock size={14} style={{ marginRight: 4 }} />
                    {extractMinutesSeconds(proposal.song.duration)}
                    <Chip label={proposal.song.genreMusic} size="small" sx={{ marginX: 2 }} />
                  </Typography>
                </CardContent>
              </Box>

              {/* Right Section - Status, Proposal Date, Actions */}
              <Box spacing={2} sx={{ display: 'flex', alignItems: 'left', justifyContent: 'space-between', minWidth: 250 }}>
                <Grid container spacing={1} justifyContent="space-between" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item md={4}>
                    {/* status */}
                    <StyledChip label={getStatus(proposal.status)} size="small" status={proposal.status} sx={{ marginX: 2 }} />
                  </Grid>
                  <Grid item md={5}>
                    {/* Proposal Date */}
                    <Typography variant="body2" color="textSecondary" marginInline={2}>
                      {getTimeAgo(proposal.proposalDate)}
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        sx={{ '&:hover': { color: 'green' } }}
                        onClick={() => handleAccept(user.userId, proposal.song.id)}
                        disabled={proposal.status != 0}
                      >
                        <TickCircle />
                      </IconButton>
                      <IconButton
                        sx={{ '&:hover': { color: 'red' } }}
                        onClick={() => handleReject(user.userId, proposal.song.id)}
                        disabled={proposal.status != 0}
                      >
                        <Cancel />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant="h6" align="center">
            <FormattedMessage id="no_proposition_found" />
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={Math.ceil(proposals.length / proposalsPerPage)} page={page} onChange={handlePageChange} />
        </Box>
      </Box>
    </>
  );
};

export default ProposalList;
