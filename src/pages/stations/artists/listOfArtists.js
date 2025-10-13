import ArtistList from 'sections/panels/widget/data/ArtistList';
import { Grid } from '@mui/material';

const ListOfArtists = () => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <ArtistList />
        </Grid>
      </Grid>
    </>
  );
};
export default ListOfArtists;
