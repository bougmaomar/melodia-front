import axios from 'axios';
import { API_URL } from 'config';

const useSpotify = () => {
  const getSpotifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/spotify/token`);
      if (response && response.status === 200) {
        return response.data.access_token;
      } else {
        throw new Error('Erreur lors de la récupération du token Spotify: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getPopularity = async (nameTrack, nameArtist) => {
    try {
      const token = await getSpotifyToken();

      const searchConfig = {
        method: 'get',
        url: `https://api.spotify.com/v1/search?q=track:${nameTrack} artist:${nameArtist}&type=track&limit=1`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios(searchConfig);
      return Math.round(response.data.tracks.items[0].popularity);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  const getPopularityAlbum = async (nameAlbum, nameArtist) => {
    try {
      const token = await getSpotifyToken();

      const searchConfig = {
        method: 'get',
        url: `https://api.spotify.com/v1/search?q=album:${nameAlbum} artist:${nameArtist}&type=album&limit=1`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios(searchConfig);

      const albumConfig = {
        method: 'get',
        url: `https://api.spotify.com/v1/albums/${response.data.albums.items[0].id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const responseAlbum = await axios(albumConfig);
      return responseAlbum.data.popularity;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return { getSpotifyToken, getPopularity, getPopularityAlbum };
};

export default useSpotify;
