import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton, TextField } from '@mui/material';
import { ScrollArea } from 'components/ScrollArea';
import { Check, CheckCheck, Edit, Trash } from 'lucide-react';
import { useChatContext } from 'contexts/ChatContext';
import { ChatInput } from './ChatInput';

export const ChatMessages = () => {
  const { messages, contactName, role, deleteMessageAsync, updateMessageAsync } = useChatContext();
  const user = JSON.parse(localStorage.getItem('user'));
  const scrollRef = useRef(null);
  const alreadyExecuted = useRef(false);
  const refresh = useRef(true);

  // Local state to track the message being edited
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // Handle enabling edit mode
  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditedContent(message.content);
  };

  // Handle updating message
  const handleUpdateMessage = async () => {
    if (editedContent.trim()) {
      await updateMessageAsync(editingMessageId, editedContent);
      setEditingMessageId(null);
    }
  };

  useEffect(() => {
    if (refresh.current && alreadyExecuted.current) {
      refresh.current = false;
      alreadyExecuted.current = false;
    } else {
      refresh.current = true;
    }
  }, [messages]);

  useEffect(() => {
    if (!scrollRef.current || alreadyExecuted.current || messages.length === 0) return;

    const scroll = scrollRef.current;
    if (scroll && scroll.scrollHeight > scroll.clientHeight) {
      scroll.scrollTop = scroll.scrollHeight;
      alreadyExecuted.current = true;
    }
  }, [messages.length]);

  return (
    <Grid>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
        <Typography variant="h5" fontWeight="semibold">
          {contactName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role}
        </Typography>
      </Box>

      <ScrollArea
        ref={scrollRef}
        sx={{
          flex: 1,
          p: 2,
          height: 'calc(60vh - 64px)',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages?.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.senderEmail === user.email ? 'flex-end' : 'flex-start'
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  borderRadius: 2,
                  p: 2,
                  marginInlineEnd: 4,
                  bgcolor: message.senderEmail === user.email ? 'primary.main' : 'grey.300',
                  color: message.senderEmail === user.email ? 'primary.contrastText' : 'text.primary',
                  position: 'relative'
                }}
              >
                {/* If editing, show input field */}
                {editingMessageId === message.id ? (
                  <TextField
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateMessage()}
                    autoFocus
                    fullWidth
                    variant="standard"
                    sx={{
                      backgroundColor: 'primary.main',
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ paddingInlineEnd: 8 }}>
                    {message.content}
                  </Typography>
                )}

                {/* Timestamp & Read Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Typography>
                  {message.senderEmail === user.email ? (
                    message.isRead ? (
                      <CheckCheck size={12} style={{ opacity: 0.9 }} />
                    ) : (
                      <Check size={12} style={{ opacity: 0.7 }} />
                    )
                  ) : null}
                </Box>

                {/* Edit & Delete Buttons */}
                {message.senderEmail === user.email && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -30,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.3
                    }}
                  >
                    <IconButton size="small" onClick={() => startEditing(message)}>
                      <Edit size={14} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteMessageAsync(message.id)}>
                      <Trash size={14} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollArea>

      {/* Input Section */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10
        }}
      >
        <ChatInput />
      </Box>
    </Grid>
  );
};
