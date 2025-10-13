import React, { useEffect } from 'react';
import { Box, Typography, Avatar, Badge } from '@mui/material';
import { ScrollArea } from 'components/ScrollArea';
import defaultImage from 'assets/images/users/default.jpeg';
import { NewChatDialog } from './NewChatDialog';
import { useChatContext } from 'contexts/ChatContext';
import { getRoleColor, getTimeAgo } from 'utils/globals/functions';

export const ChatList = () => {
  const { discussions, fetchDiscussions, handleChatClick, refresh } = useChatContext();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions, user.email, refresh]);

  return (
    <Box sx={{ p: 2 }}>
      <NewChatDialog />
      <ScrollArea
        sx={{
          flex: 1,
          p: 2,
          height: 'calc(70vh - 64px)',
          overflowY: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {discussions?.map((chat) => (
            <Box
              key={chat.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                transition: 'background 0.2s',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                backgroundColor: chat.unread > 0 ? 'action.selected' : 'transparent'
              }}
              onClick={() => handleChatClick(chat)}
            >
              <Box sx={{ position: 'relative', bgcolor: getRoleColor(chat.role), borderRadius: '50%' }}>
                <Avatar src={defaultImage} sx={{ width: 48, height: 48, m: 0.4 }} />
                {!chat.seen && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      bgcolor: 'green',
                      borderRadius: '50%'
                    }}
                  />
                )}
              </Box>
              <Box sx={{ ml: 2, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight="medium">{chat.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {chat.lastMessage && getTimeAgo(chat.time)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                    {chat.lastMessage}
                  </Typography>
                  {chat.unread > 0 && <Badge color="primary" badgeContent={chat.unread} />}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );
};
