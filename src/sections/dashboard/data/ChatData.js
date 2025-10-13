import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FormattedMessage } from 'react-intl';

// MUI
import { Card, CardContent, Typography, Avatar, Badge, Box, Grid, Tooltip, Button } from '@mui/material';
import { MessageSquare, Users, Bell, AlertCircle } from 'lucide-react';

// functions
import { getRoleColor, getTimeAgo } from 'utils/globals/functions';

// hooks
import useChat from 'hooks/useChat';

export const ChatData = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const history = useNavigate();
  const { getTotalDiscussions, getTotalMessages, getTotalUnreadMessages, getFormattedDiscussions } = useChat();
  const [totalDisc, setTotalDisc] = useState(0);
  const [totalMsg, setTotalMsg] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      const [tdisc, msgs, unread, disc] = await Promise.all([
        getTotalDiscussions(user.email),
        getTotalMessages(user.email),
        getTotalUnreadMessages(user.email),
        getFormattedDiscussions(user.email)
      ]);
      setTotalDisc(tdisc);
      setTotalMsg(msgs);
      setTotalUnread(unread);
      if (Array.isArray(disc)) {
        const sortedDiscussions = disc
          .filter((a) => a.seen === false)
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 10); // add limit
        setDiscussions(sortedDiscussions);
      } else {
        console.warn('No valid discussions returned', disc);
        setDiscussions([]);
      }
    };

    fetchData();
  }, [user?.email]);

  const mockChatStats = {
    totalDiscussions: totalDisc || 0,
    totalMessages: totalMsg || 0,
    unseenMessages: totalUnread || 0
  };
  return (
    <Box>
      <Grid container spacing={3}>
        {[
          {
            title: 'Total Discussions',
            value: mockChatStats.totalDiscussions,
            icon: <MessageSquare size={32} color="#2196F3" />
          },
          {
            title: 'Total Messages',
            value: mockChatStats.totalMessages,
            icon: <Users size={32} color="#3F51B5" />
          },
          {
            title: <FormattedMessage id="unseenMsg" />,
            value: mockChatStats.unseenMessages,
            icon: <Bell size={32} color="#E53935" />,
            color: '#E53935'
          }
        ].map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Tooltip title={stat.title} arrow>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { boxShadow: 6 } }}>
                {stat.icon} {stat.title}
                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color || 'inherit' }}>
                  {stat.value}
                </Typography>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      {discussions?.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AlertCircle size={24} color="#E53935" style={{ marginRight: 8 }} /> <FormattedMessage id="latestUnseenMsg" />
          </Typography>
          {discussions?.map((message) => (
            <Card key={message.id} sx={{ borderLeft: '5px solid #E53935', mb: 2, '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: getRoleColor(message.role), mr: 2 }} />
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  {' '}
                  {/* Ensuring it takes full width */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {message.name}
                      </Typography>
                      <Badge variant="outlined" sx={{ ml: 1, px: 1, fontSize: 12 }}>
                        {message.role}
                      </Badge>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      {getTimeAgo(message.time)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {message.lastMessage}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => history('/' + user.role.toLowerCase() + '/chat')}>
                      <FormattedMessage id="viewMessage" />
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ChatData;
