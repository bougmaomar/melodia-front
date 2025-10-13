import axios from 'utils/axios';
import { API_URL } from 'config';

const useSongs = () => {
  // function to get all Songs
  const getSongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getSongsForStation = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/system`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getArtistSongs = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/artist/${email}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Songs getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getSongsByArtistId = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/artistId/${id}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Songs getting failed, server responsed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // function to get a song by its Id
  const getSongById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Song getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getSongsByLanguage = async (languageId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/language/${languageId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Song getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getSongsByType = async (typeId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/genre/${typeId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Song getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getSongsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/artistId/${artistId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Song getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const getOneSong = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/song/${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Song getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  const getRelatedSongs = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/relatedsongs/${id}`);
      if (response && response.status === 200) {
        return response?.data?.$values;
      } else {
        throw new Error('Songs gettong failed, server responded with status: ', +response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // function to add new song
  const addNewSong = async (songData) => {
    const formData = new FormData();
    let lyricsWithLineBreaks = songData.Lyrics.replace(/\r?\n/g, '<br />');
    formData.append('Title', songData.Title);
    formData.append('ReleaseDate', songData.ReleaseDate);
    formData.append('PlatformReleaseDate', songData.PlatformReleaseDate);
    formData.append('CodeISRC', songData.CodeISRC);
    formData.append('Lyrics', lyricsWithLineBreaks);
    formData.append('IsMapleMusic', songData.IsMapleMusic);
    formData.append('IsMapleArtist', songData.IsMapleArtist);
    formData.append('IsMapleLyrics', songData.IsMapleLyrics);
    formData.append('IsMaplePerformance', songData.IsMaplePerformance);
    formData.append('SystemManage', songData.SystemManage);
    // formData.append('LanguageId', songData.LanguageId);
    formData.append('GenreMusicId', songData.GenreMusicId);
    formData.append('AlbumId', songData.AlbumId);

    if (songData.YouTube) {
      formData.append('YouTube', songData.YouTube);
    }
    if (songData.Spotify) {
      formData.append('Spotify', songData.Spotify);
    }
    if (songData.ArtistIds) {
      for (const artistId of songData.ArtistIds) {
        formData.append('ArtistIds', artistId);
      }
    }
    if (songData.LanguageIds) {
      for (const languageId of songData.LanguageIds) {
        formData.append('LanguageIds', languageId);
      }
    }
    if (songData.ComposerIds) {
      for (const composerId of songData.ComposerIds) {
        formData.append('ComposerIds', composerId);
      }
    }
    if (songData.WriterIds) {
      for (const writerId of songData.WriterIds) {
        formData.append('WriterIds', writerId);
      }
    }
    if (songData.CopyrightOwnerIds) {
      for (const crId of songData.CopyrightOwnerIds) {
        formData.append('CopyrightOwnerIds', crId);
      }
    }
    if (songData.AudioFile) {
      formData.append('AudioFile', songData.AudioFile);
    }
    if (songData.WavFile) {
      formData.append('WavFile', songData.WavFile);
    }
    if (songData.CoverImage) {
      formData.append('CoverImage', songData.CoverImage);
    }
    console.log(formData);
    console.log(songData);
    try {
      const response = await axios.post(`${API_URL}/Songs`, formData);
      if (response && response.status === 201) {
        return true;
      } else {
        throw new Error('Add Song failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      return error;
    }
  };

  // function to add new song
  const updateSong = async (id, songData) => {
    const formData = new FormData();
    let lyricsWithLineBreaks = songData.Lyrics.replace(/\r?\n/g, '<br />');
    formData.append('Title', songData.Title);
    formData.append('ReleaseDate', songData.ReleaseDate);
    formData.append('PlatformReleaseDate', songData.PlatformReleaseDate);
    formData.append('CodeISRC', songData.CodeISRC);
    formData.append('Lyrics', lyricsWithLineBreaks);
    formData.append('IsMapleMusic', songData.IsMapleMusic);
    formData.append('IsMapleArtist', songData.IsMapleArtist);
    formData.append('IsMapleLyrics', songData.IsMapleLyrics);
    formData.append('IsMaplePerformance', songData.IsMaplePerformance);
    // formData.append('LanguageId', songData.LanguageId);
    formData.append('GenreMusicId', songData.GenreMusicId);
    formData.append('AlbumId', songData.AlbumId);

    if (songData.YouTube) {
      formData.append('YouTube', songData.YouTube);
    }
    if (songData.Spotify) {
      formData.append('Spotify', songData.Spotify);
    }
    if (songData.ArtistIds) {
      for (const artistId of songData.ArtistIds) {
        formData.append('ArtistIds', artistId);
      }
    }
    if (songData.LanguageIds) {
      for (const languageId of songData.LanguageIds) {
        formData.append('LanguageIds', languageId);
      }
    }
    if (songData.ComposerIds) {
      for (const composerId of songData.ComposerIds) {
        formData.append('ComposerIds', composerId);
      }
    }
    if (songData.WriterIds) {
      for (const writerId of songData.WriterIds) {
        formData.append('WriterIds', writerId);
      }
    }
    if (songData.CopyrightOwnerIds) {
      for (const crId of songData.CopyrightOwnerIds) {
        formData.append('CopyrightOwnerIds', crId);
      }
    }
    if (songData.AudioFile) {
      formData.append('AudioFile', songData.AudioFile);
    }
    if (songData.WavFile) {
      formData.append('WavFile', songData.WavFile);
    }
    if (songData.CoverImage) {
      formData.append('CoverImage', songData.CoverImage);
    }
    console.log(songData);
    try {
      const response = await axios.put(`${API_URL}/Songs/${id}`, formData);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Add Song failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // function to update song media
  const updateSongMedia = async (songId, mediaType, media) => {
    try {
      const response = await axios.put(`${API_URL}/Songs/media?songId=${songId}&mediaType=${mediaType}&media=${media}`);
      if (response && (response.status === 200) | 204) {
        return response;
      } else {
        throw new Error('update song failed: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // function to delete a song
  const deleteSong = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/Songs/deactivate/${id}`);
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error('Song deleting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error: ', error);
    }
  };

  // function to get list of composers
  const getComposers = async () => {
    try {
      const response = await axios.get(`${API_URL}/Composers`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Composers getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // fuction to add new composer
  const addComposer = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/Composers`, name);
      if (response && response.status === 201) {
        return response.data;
      } else {
        throw new Error('Composer adding failed, server responded xith status: ' + response.status);
      }
    } catch (error) {
      console.log('Get error: ', error);
    }
  };

  // function to get list of writers
  const getWriters = async () => {
    try {
      const response = await axios.get(`${API_URL}/Writers`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Writers getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // fuction to add new writer
  const addWriter = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/Writers`, name);
      if (response && response.status === 201) {
        return response.data;
      } else {
        throw new Error('Writer adding failed, server responded xith status: ' + response.status);
      }
    } catch (error) {
      console.log('Get error: ', error);
    }
  };

  // function to get list of crOwners
  const getCROwners = async () => {
    try {
      const response = await axios.get(`${API_URL}/CROwners`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Copyright owner getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  // function to add crowner
  const addCROwner = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/CROwners`, name);
      if (response && response.status === 201) {
        return response.data;
      } else {
        throw new Error('Copyright owner adding failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const addFavoriteSong = async (userId, songId) => {
    try {
      const response = await axios.post(`${API_URL}/Songs/account/${userId}/favorite/${songId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to add favorite song, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error adding favorite song:', error);
    }
  };

  const removeFavoriteSong = async (userId, songId) => {
    try {
      const response = await axios.delete(`${API_URL}/Songs/account/${userId}/removeFavorite/${songId}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error('Failed to remove favorite song, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error removing favorite song:', error);
    }
  };

  const isSongFavorited = async (userId, songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/account/${userId}/favorite/${songId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Error checking if song is favorited:', error);
      return false;
    }
  };

  const getFavoriteSongs = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/account/${userId}`);
      if (response && response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Albums getting failed, server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Get error:', error);
    }
  };

  const putDownloads = async (songId, radioStationId) => {
    try {
      const response = await axios.post(`${API_URL}/Songs/download?songId=${songId}&radioStationId=${radioStationId}`);
      if (response && response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Get error : ', error);
    }
  };

  const getSongDownloads = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/song_downloads/${songId}`);
      if (response.status === 200) {
        return response?.data;
      } else {
        throw new Error('Get song downloads failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const putPlays = async (songId, radioStationId) => {
    try {
      const response = await axios.post(`${API_URL}/Songs/play?songId=${songId}&radioStationId=${radioStationId}`);
      if (response && response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Get error : ', error);
    }
  };

  const getSongPlays = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/song_plays/${songId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Get song plays failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const putVisits = async (songId, radioStationId) => {
    try {
      const response = await axios.post(`${API_URL}/Songs/visit?songId=${songId}&radioStationId=${radioStationId}`);
      if (response && response.status === 200) return true;
      else return false;
    } catch (error) {
      console.error('Get error : ', error);
    }
  };

  const getSongVisits = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/song_visits?songId=${songId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Get song plays failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllDownloadsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/allDownloads_artist?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get downloads failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllPlaysByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/allPlays_artist?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get downloads failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSongsByDecade = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/by_decade`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get songs by decade failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSongsByDuration = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/by_duration`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get songs by duration failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAcceptsByDecade = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/accepts_by_decade`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get accepts by decade failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAcceptsByDuration = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/accepts_by_duration`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get accepts by duration failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMostUsedTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/top_genres`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get accepts by duration failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMostUsedLanguages = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/top_languages`);
      if (response.status === 200) {
        return response.data.$values;
      } else {
        throw new Error('Get accepts by duration failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPlaysCountBySong = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/plays_by_song?songId=${songId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Get plays count by song failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDownloadsCountBySong = async (songId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/downloads_by_song?songId=${songId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('get downloads count by song failed ', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMensualSongsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/mensual_songs?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('get mensual songs failed, ', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAnnualSongsByArtist = async (artistId) => {
    try {
      const response = await axios.get(`${API_URL}/Songs/annual_songs?artistId=${artistId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        return new Error('get annual songs failed, ', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSongsStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/Songs/song_stats`);
      if (response.status === 200) {
        return response?.data;
      } else throw new Error('Get statistics failed ', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const getProposalsStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/proposals_stats`);
      if (response.status === 200) return response?.data;
      else throw new Error('proposals statistics failed ', response.status);
    } catch (error) {
      console.error(error);
    }
  };

  const getProposalsAcceptedByStation = async (stationId) => {
    try {
      const response = await axios.get(`${API_URL}/SongProposal/accepted_proposals?radioStationId=${stationId}`);
      if (response.status === 200) {
        return response.data.$values ? response.data.$values.length : 0;
      } else {
        throw new Error('Get proposals accepted by station failed', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getSongs,
    getSongsForStation,
    getArtistSongs,
    getFavoriteSongs,
    getSongsByArtistId,
    getSongById,
    getOneSong,
    getSongsByLanguage,
    getSongsByType,
    getSongsByArtist,
    getRelatedSongs,
    addNewSong,
    addFavoriteSong,
    isSongFavorited,
    removeFavoriteSong,
    updateSong,
    updateSongMedia,
    deleteSong,
    getCROwners,
    addCROwner,
    getComposers,
    addComposer,
    getWriters,
    addWriter,
    putDownloads,
    getSongDownloads,
    putPlays,
    getSongPlays,
    putVisits,
    getSongVisits,
    getAllDownloadsByArtist,
    getAllPlaysByArtist,
    getSongsByDecade,
    getSongsByDuration,
    getAcceptsByDecade,
    getAcceptsByDuration,
    getMostUsedTypes,
    getMostUsedLanguages,
    getPlaysCountBySong,
    getDownloadsCountBySong,
    getMensualSongsByArtist,
    getAnnualSongsByArtist,
    getSongsStatistics,
    getProposalsStatistics,
    getProposalsAcceptedByStation
  };
};

export default useSongs;
