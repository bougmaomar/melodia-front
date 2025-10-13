import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { ChatList } from 'sections/chat/ChatList';
import { ChatMessages } from 'sections/chat/ChatMessages';

const Chat = () => {
  const [chatId, setChatId] = useState(0);
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [dis, setDis] = useState('');

  return (
    <Grid container>
      <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider' }}>
        <ChatList setChatId={setChatId} setContact={setContact} setRole={setRole} setReceiverEmail={setReceiverEmail} dis={dis} />
      </Grid>

      <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column' }}>
        <ChatMessages id={chatId} name={contact} role={role} receiver={receiverEmail} setDis={setDis} />
      </Grid>
    </Grid>
  );
};

export default Chat;
