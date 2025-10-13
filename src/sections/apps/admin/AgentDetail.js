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
  ListItemSecondaryAction,
  Stack,
  Typography,
  Avatar,
  Button,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
// import { API_MEDIA_URL } from 'config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAdmin from 'hooks/useAdmin';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { CallCalling, Sms, Global } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';
import { API_MEDIA_URL } from 'config';

const avatarImage = require.context('assets/images/users', true);

const AgentDetail = ({ agentEmail, onGetStatus }) => {
  const [agent, setAgent] = useState(null);
  const { getAgentByEmail, acceptAgent, rejectAgent } = useAdmin();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const defaultAvatar = avatarImage('./default.jpeg');

  const fetchAgent = useCallback(async () => {
    try {
      const agentData = await getAgentByEmail(agentEmail);
      setAgent(agentData);
    } catch (error) {
      console.error('Error fetching agent details:', error);
    }
  }, [agentEmail]);

  useEffect(() => {
    if (agentEmail) {
      fetchAgent();
    }
  }, [agentEmail]);

  const sendEmail = async (templateId, agentName, agentEmail, password = '') => {
    const templateParams = {
      to_name: agentName,
      to_email: agentEmail,
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
      await acceptAgent(agent.agentId);
      setAgent((prev) => ({ ...prev, status: 'Accepted' }));
      onGetStatus('Accepted');
      toast.success(`${agent.agentRealName} has been accepted!`);
      const [firstName] = agent.agentRealName.split(' ');

      // Send acceptance email
      await sendEmail(
        'template_wo0ibqm', // Replace with your actual accept template ID
        agent.agentRealName,
        agent.email,
        `Agent.${firstName}123@` // Example password format
      );
    } catch (error) {
      console.error('Error accepting agent:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectAgent(agent.agentId);
      setAgent((prev) => ({ ...prev, status: 'Rejected' }));
      onGetStatus('Rejected');
      toast.error(`${agent.agentRealName} has been rejected.`);

      // Send rejection email
      await sendEmail(
        'template_ktyazze', // Replace with your actual reject template ID
        agent.agentRealName,
        agent.email
      );
    } catch (error) {
      console.error('Error rejecting agent:', error);
    }
    handleCloseRejectDialog();
  };

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
  };

  if (!agent) {
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

      const response = await PutResetPassord(agent.id, newPassword);
      if (response && response.status === 200) {
        await sendEmail(
          'template_wo0ibqm', // Replace with your actual reset password template ID
          agent.email,
          agent.email,
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
                label={agent.status}
                size="small"
                color={agent.status === 'Accepted' ? 'success' : agent.status === 'Rejected' ? 'error' : 'warning'}
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
                      alt="Agent Avatar"
                      src={agent.photoProfile ? `${API_MEDIA_URL}${agent.photoProfile}` : defaultAvatar}
                      sx={{ width: 70, height: 70 }}
                    />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography color="secondary">
                        <FormattedMessage id="fullName" />
                      </Typography>
                      <Typography variant="h5">{agent.agentRealName}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Link align="right" href={`mailto:${agent.email}`} target="_blank">
                          {agent.email}
                        </Link>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CallCalling size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>{agent.phoneNumber}</ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Global size={18} />
                      </ListItemIcon>
                      <ListItemSecondaryAction>
                        <Link align="right" href={agent.webSite} target="_blank">
                          {agent.webSite}
                        </Link>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={agent.status === 'Accepted'}
                  onClick={handleAccept}
                  sx={{ px: 4, py: 1 }}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={agent.status === 'Rejected'}
                  onClick={handleOpenRejectDialog}
                  sx={{ px: 4, py: 1 }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResetPassword}
                  sx={{ px: 4, py: 1 }}
                  disabled={agent.status !== 'Accepted'}
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
                            <FormattedMessage id="firstName" />
                          </Typography>
                          <Typography>{agent.agentRealName.split(' ')[0]}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="lastName" />
                          </Typography>
                          <Typography>{agent.agentRealName.split(' ')[1]}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>

                  <ListItem>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="Career_Start_Date" />
                          </Typography>
                          <Typography>{new Date(agent.careerStartDate).toDateString()}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={0.5}>
                          <Typography color="secondary">
                            <FormattedMessage id="nbrArtist" />
                          </Typography>
                          <Typography>{agent.artistsNum}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </MainCard>
              <MainCard title={<FormattedMessage id="bio" />}>
                <Typography color="secondary">{agent.bio}</Typography>
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
            <FormattedMessage id="rejection" /> {agent.agentRealName}?
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

AgentDetail.propTypes = {
  agentEmail: PropTypes.string.isRequired,
  onGetStatus: PropTypes.func
};

export default AgentDetail;
