import React, { useState } from 'react';
import { Grid, Box, Button, IconButton, TextField } from '@mui/material';
import { Send, Mail, Music } from 'lucide-react';
import { useChatContext } from 'contexts/ChatContext';

export const ChatInput = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { sendChatMessage, currentChat, receiverEmail, fetchMessages } = useChatContext();
  const [message, setMessage] = useState('');

  const handleSend = async (content) => {
    if (content.trim()) {
      const res = await sendChatMessage(currentChat.id, content);
      if (res) {
        setMessage('');
        fetchMessages();
      }
    }
  };

  const handleOpenGmail = () => {
    const email = receiverEmail;
    const subject = encodeURIComponent('Chat Message');
    const body = encodeURIComponent(`Hello,\n\n${message}\n\nBest regards,\n${user.email}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Box>
      {currentChat && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(message);
              }
            }}
          />
          <Button onClick={() => handleSend(message)} sx={{ px: 2 }} disabled={!message.trim()} variant="contained">
            <Send size={16} />
          </Button>

          <Grid display="column" sx={{ pr: 1 }}>
            <IconButton onClick={handleOpenGmail} color="primary">
              <Mail size={20} />
            </IconButton>

            <IconButton color="secondary" disabled={user.role == 'Station'}>
              <Music size={20} />
            </IconButton>
          </Grid>
        </Box>
      )}
    </Box>
  );
};
