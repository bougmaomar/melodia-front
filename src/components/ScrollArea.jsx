import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const ScrollArea = React.forwardRef(({ children, sx, ...props }, ref) => (
  <StyledScrollArea ref={ref} sx={sx} {...props}>
    {children}
  </StyledScrollArea>
));

ScrollArea.displayName = 'ScrollArea';

const StyledScrollArea = styled(Box)({
  position: 'relative',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
    height: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#ccc',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#999'
  }
});

export { ScrollArea };
