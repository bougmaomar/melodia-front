import React from 'react';
import { Grid } from '@mui/material';
import { ChatList } from 'sections/chat/ChatList';
import { ChatMessages } from 'sections/chat/ChatMessages';

const Chat = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
        <ChatList />
      </Grid>

      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
        <ChatMessages />
      </Grid>
    </Grid>
  );
};

export default Chat;
