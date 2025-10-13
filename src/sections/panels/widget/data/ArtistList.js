// material-ui
import { Avatar, CardContent, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// project-imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import Dot from 'components/@extended/Dot';

// assets
import useAdmin from 'hooks/useAdmin';
import { API_MEDIA_URL } from 'config';

const avatarImage = require.context('assets/images/users', true);

// ===========================|| DATA WIDGET - NEW CUSTOMERS ||=========================== //

const ArtistList = () => {
  const [artists, setArtists] = useState();
  const { getArtists } = useAdmin();
  const defaultAvatar = avatarImage('./default.jpeg');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists = await getArtists();
        setArtists(artists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <MainCard content={false}>
      <SimpleBar sx={{ height: 600 }}>
        <CardContent>
          <Grid container spacing={4} alignItems="center">
            {artists &&
              artists.map((artist, index) => (
                <Grid item xs={12} lg={6} key={index}>
                  <Link to={`/radio-station/artist/${artist.artistId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar
                          alt="coverimage"
                          sx={{ width: 60, height: 60 }}
                          variant="circle"
                          src={artist.photoProfile ? `${API_MEDIA_URL}${artist.photoProfile}` : defaultAvatar}
                        />
                      </Grid>
                      <Grid item xs zeroMinWidth>
                        <Typography align="left" variant="h5">
                          <strong>{artist.artistRealName}</strong>
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs zeroMinWidth>
                            <Typography align="left" color="text.secondary" variant="h6">
                              {artist.email}
                            </Typography>
                          </Grid>
                          <Grid item sx={{ display: 'flex' }}>
                            <Dot color="success" size={10} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Link>
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </SimpleBar>
    </MainCard>
  );
};

export default ArtistList;
