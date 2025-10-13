import { useContext } from 'react';

// auth provider
import AlbumsContext from 'contexts/AlbumContext';

// ==============================|| HOOKS - AUTH ||============================== //

const useAlbums = () => {
  const context = useContext(AlbumsContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useAlbums;
