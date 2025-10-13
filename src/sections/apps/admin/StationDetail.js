import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import emailjs from 'emailjs-com';
import {
  Box,
  Grid,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Button,
  ListItemSecondaryAction,
  Stack,
  Typography,
  Avatar,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { API_MEDIA_URL } from 'config';
import { ToastContainer, toast } from 'react-toastify';
import useAdmin from 'hooks/useAdmin';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { Sms, Global, CallCalling } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

const avatarImage = require.context('assets/images/users', true);

const StationDetail = ({ stationEmail, onGetStatus }) => {
  const [station, setStation] = useState(null);
  const { getStationByEmail, acceptStation, rejectStation, PutResetPassord } = useAdmin();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const defaultAvatar = avatarImage('./default.jpeg');

  const fetchStation = useCallback(async () => {
    try {
      const stationData = await getStationByEmail(stationEmail);
      setStation(stationData);
    } catch (error) {
      console.error('Error fetching station details:', error);
    }
  }, [stationEmail]);

  useEffect(() => {
    if (stationEmail) {
      fetchStation();
    }
  }, [stationEmail]);

  const sendEmail = async (templateId, stationName, stationEmail, password = '') => {
    const templateParams = {
      to_name: stationName,
      to_email: stationEmail,
      password: password
    };

    try {
      await emailjs.send(
        'service_qz2ye2e', // Replace with your service ID
        templateId, // Replace with your template ID
        templateParams,
        'rwYz2En0M8hTky5MH' // Replace with your public key (user ID)
      );
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email.');
    }
  };

  const handleAccept = async () => {
    try {
      await acceptStation(station.stationId);
      setStation((prev) => ({ ...prev, status: 'Accepted' }));
      onGetStatus('Accepted');
      toast.success(`${station.stationName} has been accepted!`);

      // Send acceptance email
      await sendEmail(
        'template_wo0ibqm', // Replace with your actual accept template ID
        station.stationName,
        station.email,
        `Station.${station.stationName}123@` // Example password format
      );
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error accepting station:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectStation(station.stationId);
      setStation((prev) => ({ ...prev, status: 'Rejected' }));
      onGetStatus('Rejected');
      toast.error(`${station.stationName} has been rejected.`);

      // Send rejection email
      await sendEmail(
        'template_ktyazze', // Replace with your actual reject template ID
        station.stationName,
        station.email
      );
    } catch (error) {
      console.error('Error rejecting station:', error);
    }
    handleCloseRejectDialog();
  };

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
  };

  if (!station) {
    return <Typography>Loading...</Typography>;
  }

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specials = '!@#$%^&*()_+-=';
    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      specials[Math.floor(Math.random() * specials.length)]
    ];
    const all = upper + lower + digits + specials;
    for (let i = password.length; i < 12; i++) {
      password.push(all[Math.floor(Math.random() * all.length)]);
    }
    password = password.sort(() => Math.random() - 0.5);
    return password.join('');
  };

  const handleResetPassword = async () => {
    try {
      // Assuming you have a function to reset the password
      const newPassword = generatePassword();

      const response = await PutResetPassord(station.id, newPassword);
      if (response && response.status === 200) {
        await sendEmail(
          'template_wo0ibqm', // Replace with your actual reset password template ID
          station.stationName,
          station.email,
          newPassword
        );
        toast.success('Password reset successfully!');
      } else {
        toast.error('Failed to reset password. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />

      <Transitions type="slide" direction="down" in={true}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={4}>
            <MainCard>
              <Chip
                label={station.status}
                size="small"
                color={station.status === 'Accepted' ? 'success' : station.status === 'Rejected' ? 'error' : 'warning'}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  fontSize: '0.675rem'
                }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt="Station Avatar"
                      src={station.logo ? `${API_MEDIA_URL}${station.logo}` : defaultAvatar}
                      sx={{ width: 70, height: 70 }}
                    />

                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{station.stationName}</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                {/* <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-around" alignItems="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="secondary">Career Start Date</Typography>
                      <Typography variant="h5">{new Date(station.careerStartDate).toDateString()}</Typography>
                    </Stack>
                  </Stack>
                </Grid> */}
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                    {station.email && (
                      <ListItem>
                        <ListItemIcon>
                          <Sms size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={`mailto:${station.email}`} target="_blank">
                            {station.email}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                    {station.phoneNumber && (
                      <ListItem>
                        <ListItemIcon>
                          <CallCalling size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>{station.phoneNumber}</ListItemSecondaryAction>
                      </ListItem>
                    )}
                    {station.webSite && (
                      <ListItem>
                        <ListItemIcon>
                          <Global size={18} />
                        </ListItemIcon>
                        <ListItemSecondaryAction>
                          <Link align="right" href={`mailto:${station.webSite}`} target="_blank">
                            {station.webSite}
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={station.status === 'Accepted'}
                  onClick={handleAccept}
                  sx={{ px: 4, py: 1 }}
                >
                  <FormattedMessage id="accept" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={station.status === 'Rejected'}
                  onClick={handleOpenRejectDialog}
                  sx={{ px: 4, py: 1 }}
                >
                  <FormattedMessage id="reject" />
                </Button>
                <Button
                  variant="contained"
                  disabled={station.status !== 'Accepted'}
                  color="primary"
                  onClick={handleResetPassword}
                  sx={{ px: 4, py: 1 }}
                >
                  <FormattedMessage id="reset_password" defaultMessage="Reset Password" />
                </Button>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5}>
              <MainCard title="Personal Details">
                <List sx={{ py: 0 }}>
                  <ListItem divider={!matchDownMD}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="fullName" />
                          </Typography>
                          <Typography>{station.stationName}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="Career_Start_Date" />
                          </Typography>
                          <Typography>{new Date(station.foundationDate).toDateString()}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Stack spacing={0.5}>
                      <Typography color="secondary">
                        <FormattedMessage id="frequency" />
                      </Typography>
                      <Typography>{station.frequency}</Typography>
                    </Stack>
                  </ListItem>
                </List>
              </MainCard>
              <MainCard title={<FormattedMessage id="bio" />}>
                <Typography color="secondary">{station.bio}</Typography>
              </MainCard>
            </Stack>
          </Grid>
        </Grid>
      </Transitions>
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Rejection'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage id="rejection" /> {station.stationName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="primary">
            <FormattedMessage id="cancel" />
          </Button>
          <Button onClick={handleReject} color="error" autoFocus>
            <FormattedMessage id="reject" />
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

StationDetail.propTypes = {
  stationEmail: PropTypes.string.isRequired,
  onGetStatus: PropTypes.func
};

export default StationDetail;
