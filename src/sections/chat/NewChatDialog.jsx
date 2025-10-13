import React, { useState, useEffect } from 'react';
import { API_MEDIA_URL } from 'config';

// material UI
import { Dialog, DialogTitle, DialogContent, Button, TextField, Box, Avatar, IconButton, Typography } from '@mui/material';
import { MessageSquarePlus, Search } from 'lucide-react';
import { CloseCircle } from 'iconsax-react';
import defaultImage from 'assets/images/users/default.jpeg';
import { FormattedMessage } from 'react-intl';

//
import { getRoleColor } from 'utils/globals/functions';
// Hooks
import useAdmin from 'hooks/useAdmin';
// import useChat from 'hooks/useChat';
import { useChatContext } from 'contexts/ChatContext';

export const NewChatDialog = () => {
  const { getArtists, getAgents, getStations } = useAdmin();
  // const { startDiscussion } = useChat();
  const { startChat } = useChatContext();

  const user = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(['Artist', 'Agent', 'Station']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agents, artists, stations] = await Promise.all([getAgents(), getArtists(), getStations()]);

        const formattedUsers = [
          ...agents
            .filter((agent) => agent.email !== user.email)
            .map((agent) => ({
              id: `agent-${agent.agentId}`,
              userId: agent.agentId,
              name: agent.agentRealName,
              email: agent.email,
              photo: agent.photoProfile || defaultImage,
              role: 'Agent'
            })),
          ...artists
            .filter((artist) => artist.email !== user.email)
            .map((artist) => ({
              id: `artist-${artist.artistId}`,
              userId: artist.artistId,
              name: artist.artistRealName,
              email: artist.email,
              photo: artist.photoProfile || defaultImage,
              role: 'Artist'
            })),
          ...stations
            .filter((station) => station.email !== user.email)
            .map((station) => ({
              id: `station-${station.stationId}`,
              userId: station.stationId,
              name: station.stationName,
              email: station.email,
              photo: station.logo || defaultImage,
              role: 'Station'
            }))
        ];

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const handleStartChat = async (email) => {
    const res = await startChat(user.email, email);
    if (res) {
      setOpen(false);
    }
  };

  const toggleRole = (role) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const filteredUsers = users?.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) && selectedRoles.includes(user.role);
  });

  return (
    <>
      <Button variant="contained" fullWidth startIcon={<MessageSquarePlus size={20} />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        <FormattedMessage id="new_discussion" />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormattedMessage id="new_discussion" />
          <IconButton onClick={() => setOpen(false)}>
            <CloseCircle />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Role Filter Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {['Artist', 'Agent', 'Station'].map((role) => (
              <Button
                key={role}
                size="small"
                variant={selectedRoles.includes(role) ? 'contained' : 'outlined'}
                onClick={() => toggleRole(role)}
                sx={{
                  textTransform: 'capitalize',
                  bgcolor: selectedRoles.includes(role) ? getRoleColor(role) : 'transparent',
                  color: selectedRoles.includes(role) ? '#fff' : 'inherit',
                  '&:hover': {
                    bgcolor: selectedRoles.includes(role) ? getRoleColor(role) : 'action.hover'
                  }
                }}
              >
                {role}
              </Button>
            ))}
          </Box>

          {/* Search Input */}
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 10, color: '#aaa' }} />
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ pl: 4 }}
            />
            {searchQuery && (
              <IconButton onClick={() => setSearchQuery('')} sx={{ position: 'absolute', right: 5 }}>
                <CloseCircle size={18} />
              </IconButton>
            )}
          </Box>

          {/* User List */}
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto', mt: 2 }}>
            {filteredUsers &&
              filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleStartChat(user.email)}
                >
                  <Box sx={{ bgcolor: getRoleColor(user.role), borderRadius: '50%' }}>
                    <Avatar
                      src={`${API_MEDIA_URL}${user.photo}`}
                      sx={{ bgcolor: getRoleColor(user.role), width: 40, height: 40, m: 0.4 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                      {user.role}
                    </Typography>
                  </Box>
                </Box>
              ))}
            {filteredUsers?.length === 0 && (
              <Typography textAlign="center" color="text.secondary" sx={{ py: 3 }}>
                No users found
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
